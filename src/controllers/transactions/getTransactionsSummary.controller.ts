import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../config/prisma.js';
import type { getTransactionsSummarySchemaQuery } from '../../schemas/transaction.schema.js';

dayjs.extend(utc);

export const getTransactionsSummary = async (
	request: FastifyRequest<{ Querystring: getTransactionsSummarySchemaQuery }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = 'FENBBEFEIK';

	if (!userId) {
		reply.status(401).send({ error: 'Usuário não autenticado' });
		return;
	}

	const { month, year } = request.query;

	if (!month || !year) {
		reply.status(400).send({ error: 'Mês e Ano são obrigatórios' });
		return;
	}

	const startDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
	const endDate = dayjs.utc(startDate).endOf('month').toDate();

	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			orderBy: {},
			include: {
				category: true,
			},
		});

		reply.send(transactions);
	} catch (err) {
		request.log.error(err, 'Erro ao trazer transações');
		reply.status(500).send({ error: 'Erro do Servidor' });
	}
};
