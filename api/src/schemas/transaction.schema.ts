import { TransactionType } from '@prisma/client';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const createTransactionSchema = z.object({
	description: z.string().min(1, 'Descrição obrigatória'),
	amount: z.number().positive('Valor deve ser positivo'),
	date: z.coerce.date({
		required_error: 'Data obrigatória',
		invalid_type_error: 'Data inválida',
	}),
	categoryId: z.string().refine(isValidObjectId, {
		message: 'Categoria inválida',
	}),
	type: z.nativeEnum(TransactionType, {
		required_error: 'Tipo obrigatório',
		invalid_type_error: 'Tipo inválido',
	}),
});

export const getTransactionSchema = z.object({
	month: z.string().optional(),
	year: z.string().optional(),
	type: z
		.nativeEnum(TransactionType, {
			invalid_type_error: 'Tipo inválido',
		})
		.optional(),
	categoryId: z
		.string()
		.refine(isValidObjectId, {
			message: 'Categoria inválida',
		})
		.optional(),
});

export const getTransactionsSummarySchema = z.object({
	month: z.string({ required_error: 'O mês é obrigatório' }),
	year: z.string({ required_error: 'O ano é obrigatório' }),
});

export const getTransactionRecordSchema = z.object({
	month: z.coerce.number().min(1).max(12),
	year: z.coerce.number().min(2000).max(2100),
	months: z.coerce.number().min(1).max(12).optional(),
});

export const deleteTransactionSchema = z.object({
	id: z.string().refine(isValidObjectId, {
		message: 'ID inválido',
	}),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionSchema>;
export type GetTransactionsSummarySchemaQuery = z.infer<typeof getTransactionsSummarySchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;
export type GetTransactionRecordQuery = z.infer<typeof getTransactionRecordSchema>;
