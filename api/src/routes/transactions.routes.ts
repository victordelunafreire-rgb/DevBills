import type { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import createTransaction from '../controllers/transactions/createTransaction.controller.js';
import { deleteTransaction } from '../controllers/transactions/deleteTransaction.controller.js';
import { getTransactions } from '../controllers/transactions/getTransactions.controller.js';
import { getTransactionsSummary } from '../controllers/transactions/getTransactionsSummary.controller.js';
import {
	createTransactionSchema,
	deleteTransactionSchema,
	getTransactionSchema,
	getTransactionsSummarySchema,
} from '../schemas/transaction.schema.js';

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

	//Search Summary

	fastify.route({
		method: 'GET',
		url: '/summary',
		schema: {
			querystring: zodToJsonSchema(getTransactionsSummarySchema),
		},
		handler: getTransactionsSummary,
	});

	//Delete transaction

	fastify.route({
		method: 'DELETE',
		url: '/:id',
		schema: {
			params: zodToJsonSchema(deleteTransactionSchema),
		},
		handler: deleteTransaction,
	});
};

export default transactionRoutes;
