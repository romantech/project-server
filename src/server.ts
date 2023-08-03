import setupRoutes from './routes';
import { createServer, errorHandler, notFoundHandler } from './config';

const PORT = process.env.PORT || 3001;

const initServer = (): void => {
  const app = createServer();
  setupRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

initServer();
