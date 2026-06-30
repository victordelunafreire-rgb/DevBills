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

export type getTransactionsQuery = z.infer<typeof getTransactionSchema>;
