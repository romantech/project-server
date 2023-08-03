import { Router } from 'express';

const router = Router();

router.get(['/', '/health'], (_req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'Server is up and running',
    timestamp: Date.now(),
    status: 'OK',
  };
  res.send(healthCheck);
});
export default router;
