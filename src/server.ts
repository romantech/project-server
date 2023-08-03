import setupRoutes from './routes';
import { createServer, errorHandler, notFoundHandler } from '@/config';
import { isProd, PORT } from '@/config/environment';

const initServer = (): void => {
  console.log('current port', PORT);
  console.log('isProd', isProd());
  const app = createServer();
  setupRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

initServer();
