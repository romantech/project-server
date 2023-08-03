import setupRoutes from './routes';
import { createServer, errorHandler, notFoundHandler } from '@/config';
import { HOST, PORT } from '@/config/environment';

const initServer = (): void => {
  if (!PORT) {
    console.error('Error: The PORT environment variable is not defined.');
    process.exit(1);
  }

  const app = createServer();
  setupRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server is running at ${HOST}:${PORT}`));
};

initServer();
