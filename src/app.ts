import Fastify from 'fastify';
import { env } from './config/env.js';
import routes from './routes/index.js';

const app = Fastify({
	logger: {
		level: env.NODE_ENV === 'dev' ? 'info' : 'error',
	},
});

app.register(routes, { prefix: '/api' });

export default app;
