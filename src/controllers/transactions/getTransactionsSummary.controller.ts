import { TransactionType } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../config/prisma.js';
import type { getTransactionsSummarySchemaQuery } from '../../schemas/transaction.schema.js';
import type { CatgegorySummary } from '../../types/category.types.js';
import type { TransactionsSummary } from '../../types/transaction.types.js';

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

		let totalExpenses = 0;
		let totalIncomes = 0;
		const groupedExpenses = new Map<string, CatgegorySummary>();

		for (const transaction of transactions) {
			if (transaction.type === TransactionType.expense) {
				const existing = groupedExpenses.get(transaction.categoryId) ?? {
					categroyId: transaction.categoryId,
					categoryName: transaction.category.name,
					categoryColor: transaction.category.color,
					amount: 0,
					percentage: 0,
				};

				existing.amount += transaction.amount;

				groupedExpenses.set(transaction.categoryId, existing);

				totalExpenses += transaction.amount;
			} else {
				totalIncomes += transaction.amount;
			}
		}

		const summary: TransactionsSummary = {
			totalExpenses,
			totalIncomes,
			balance: Number.parseFloat((totalIncomes - totalExpenses).toFixed(2)),
			expensesByCategory: Array.from(groupedExpenses.values())
				.map((entry) => ({
					...entry,
					percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)),
				}))
				.sort((a, b) => b.amount - a.amount),
		};
		reply.send(summary);
	} catch (err) {
		request.log.error(err, 'Erro ao trazer transações');
		reply.status(500).send({ error: 'Erro do Servidor' });
	}
};
