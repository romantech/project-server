import dotenv from 'dotenv';
import { createServer } from './config/express';

dotenv.config();

const app = createServer();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
