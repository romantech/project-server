import setupRoutes from '@/routes';
import { createServer, errorHandler, notFoundHandler, PORT } from '@/config';

const initServer = (): void => {
  const app = createServer();
  setupRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

initServer();
