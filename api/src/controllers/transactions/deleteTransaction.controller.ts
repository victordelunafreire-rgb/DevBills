import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../config/prisma.js';
import type { DeleteTransactionParams } from '../../schemas/transaction.schema.js';

export const deleteTransaction = async (
	request: FastifyRequest<{ Params: DeleteTransactionParams }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = 'FENBBEFEIK';
	const { id } = request.params;

	if (!userId) {
		reply.status(401).send({ error: 'Usuário não autenticado' });
		return;
	}

	try {
		const transaction = await prisma.transaction.findFirst({
			where: {
				id,
				userId,
			},
		});

		if (!transaction) {
			reply.status(400).send({ error: 'ID da transacao inválido' });
			return;
		}

		await prisma.transaction.delete({ where: { id } });

		reply.status(200).send({ message: 'Transacao deletada com sucesso' });
	} catch (err) {
		request.log.error(err, 'Erro ao deletar transacao');
		reply.status(500).send({ error: 'Erro interno do servidor, falha ao deletar transacao' });
	}
};
