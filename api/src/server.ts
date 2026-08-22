import app from './app.js';
import { env } from './config/env.js';
import initializeAppFirebaseAdmin from './config/firebase.js';
import { prismaConnect } from './config/prisma.js';
import { initializeGlobalCategories } from './services/globalCategories.service.js';

const PORT = env.PORT;

initializeAppFirebaseAdmin();

const startServer = async () => {
	try {
		await prismaConnect();

		await initializeGlobalCategories();

		await app.listen({ port: PORT }).then(() => {
			console.log(`Servidor rodando na porta ${PORT} `);
		});
	} catch (err) {
		console.error(err);
	}
};

startServer();
