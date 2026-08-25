import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../config/prisma.js';
import type { GetTransactionRecordQuery } from '../../schemas/transaction.schema.js';

dayjs.locale('pt-br');
dayjs.extend(utc);

export const getTransactionsRecord = async (
	request: FastifyRequest<{ Querystring: GetTransactionRecordQuery }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;

	if (!userId) {
		return reply.status(401).send({ error: 'Usuário não autenticado' });
	}

	const { month, year, months = 6 } = request.query;

	const dateBase = new Date(year, month - 1, 1);

	const startDate = dayjs
		.utc(dateBase)
		.subtract(months - 1, 'month')
		.startOf('month')
		.toDate();
	const endDate = dayjs.utc(dateBase).endOf('month').toDate();

	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			select: {
				amount: true,
				type: true,
				date: true,
			},
		});

		const monthlyData = Array.from({ length: months }, (_, i) => {
			const date = dayjs.utc(dateBase).subtract(months - 1 - i, 'months');

			return {
				name: date.format('MMM/YYYY'),
				income: 0,
				expense: 0,
			};
		});

		transactions.forEach((transaction) => {
			const monthKey = dayjs.utc(transaction.date).format('MMM/YYYY');
			const monthDate = monthlyData.find((m) => m.name === monthKey);

			if (monthDate) {
				if (transaction.type === 'income') {
					monthDate.income += transaction.amount;
				} else {
					monthDate.expense += transaction.amount;
				}
			}
		});

		reply.send({ record: monthlyData });
	} catch (err) {}
};
