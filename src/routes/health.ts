import { Router } from 'express';
import IP from 'ip';

const router = Router();

router.get(['/', '/health'], (req, res) => {
  const ip = IP.address();

  const healthCheck = {
    uptime: process.uptime(),
    message: 'Server is up and running',
    timestamp: Date.now(),
    status: 'OK',
    ip_address: ip,
  };
  res.send(healthCheck);
});
export default router;
