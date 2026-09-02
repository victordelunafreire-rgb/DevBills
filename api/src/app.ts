import cors from '@fastify/cors';
import Fastify from 'fastify';
import { env } from './config/env.js';
import routes from './routes/index.js';

const app = Fastify({
	logger: {
		level: env.NODE_ENV === 'dev' ? 'info' : 'error',
	},
});

app.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PACTH', 'OPTIONS'],
});

app.register(routes, { prefix: '/api' });

export default app;
