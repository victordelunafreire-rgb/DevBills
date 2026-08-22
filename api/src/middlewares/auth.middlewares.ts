import { FastifyReply, FastifyRequest } from 'fastify';
import { getAuth } from 'firebase-admin/auth';

declare module 'fastify' {
	interface FastifyRequest {
		userId?: string;
	}
}

export const authMiddleware = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	// const authHeader = request.headers.authorization;
	const authHeader =
		'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZhYzkwNDdmNjcxMmZjZDVjZjY3YTMzMDc5NDFkOWZhNDIyODM5NTUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVGhlTWVhbmluZ1ZhdWx0IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lnMktjMHpmbHJkMzg3dXpCemlXVE5xSDZVUzEyUExva2txM2d6akNvTWF6UTVUM2c9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZGV2YmlsbHMtZTk0MzQiLCJhdWQiOiJkZXZiaWxscy1lOTQzNCIsImF1dGhfdGltZSI6MTc4NzExMDQ5MywidXNlcl9pZCI6IlNEQTBkcEQweWJRMEVXUHV0dlRRQTdQZzVVbzEiLCJzdWIiOiJTREEwZHBEMHliUTBFV1B1dHZUUUE3UGc1VW8xIiwiaWF0IjoxNzg3NDM0MjczLCJleHAiOjE3ODc0Mzc4NzMsImVtYWlsIjoidGhlbWVhbmluZ3ZhdWx0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTEzNDg2MDQ5MDA5ODU5ODA5NTMyIl0sImVtYWlsIjpbInRoZW1lYW5pbmd2YXVsdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.br7yWjTKjE6_87MWo_I3BXrLSLfcB5ORA2-2RR5aEcQRM8SoOG0GqadNPo_Tl63j7hyPDWGtLYTZ0Wy1ikFcZ9fJuIz0LoyDVASw738yE3DdcXacm9VmB-gDHkyKdSdC1HBAev5mYsYkvTglAttlwZPW-_h3eJmYMd6mjXQeqdsh04AwGSRq83-LoX-T_4H80C1fUL5hDSIQ5Gw7V33gAXLKXpodtblXFH5ztcUgOpMGvVf-oYpAgi8QRbQPYPPbBMTc7rBOkuxrR4i19jh9J79KgUDnTLf2nJ-jKyR4FMrzgNz83OgxLYf4JGOHbQLqV5HnALhS7mE4nrP-JlRRFQ';

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		reply.code(401).send({ error: 'Token de autorização não fornecido' });
		return;
	}

	const token = authHeader.replace('Bearer ', '');

	try {
		const decodedToken = await getAuth().verifyIdToken(token);

		request.userId = decodedToken.uid;
	} catch (err) {
		request.log.error(err, 'Erro ao verificar Token');
		reply.code(401).send({ error: 'Token inválido ou expirado' });
	}
};
