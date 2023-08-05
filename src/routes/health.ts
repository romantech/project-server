import { Router } from 'express';

const router = Router();

router.get(['/', '/health'], (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'Server is up and running',
    timestamp: Date.now(),
    status: 'OK',
    ip_address: req.ip,
  };
  res.send(healthCheck);
});
export default router;
