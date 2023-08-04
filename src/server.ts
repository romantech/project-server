import setupRoutes from './routes';
import { createServer, errorHandler, notFoundHandler } from '@/config';
import { PORT } from '@/config/environment';

const initServer = (): void => {
  console.log('@@@', process.env.OPEN_AI_API_KEY);
  const app = createServer();
  setupRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

initServer();
