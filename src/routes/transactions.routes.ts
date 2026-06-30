import type { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import createTransaction from '../controllers/transactions/createTransaction.controller.js';
import { getTransactions } from '../controllers/transactions/getTransactions.controller.js';
import { createTransactionSchema, getTransactionSchema } from '../schemas/transaction.schema.js';

const transactionRoutes = async (fastify: FastifyInstance) => {
	// Creation
	fastify.route({
		method: 'POST',
		url: '/',
		schema: {
			body: zodToJsonSchema(createTransactionSchema),
		},
		handler: createTransaction,
	});

	// Filtered Search

	fastify.route({
		method: 'GET',
		url: '/',
		schema: {
			querystring: zodToJsonSchema(getTransactionSchema),
		},
		handler: getTransactions,
	});
};

export default transactionRoutes;
