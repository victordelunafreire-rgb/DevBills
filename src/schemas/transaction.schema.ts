import { TransactionType } from '@prisma/client';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const createTransactionSchema = z.object({
	description: z.string().min(1, 'Descrição obrigatória'),
	amount: z.number().positive('Valor deve ser positivo'),
	date: z.coerce.date({
		message: 'Data inválida',
	}),
	categoryId: z.string().refine(isValidObjectId, {
		message: 'Categoria inválida',
	}),
	type: z.nativeEnum(TransactionType, {
		message: 'Tipo inválido',
	}),
});
