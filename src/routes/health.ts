import { Router } from 'express';
import requestIP from 'request-ip';

const router = Router();

router.get(['/', '/health'], (req, res) => {
  const client_ip = requestIP.getClientIp(req);
  const healthCheck = {
    uptime: process.uptime(),
    message: 'Server is up and running',
    timestamp: Date.now(),
    status: 'OK',
    client_ip,
  };
  res.send(healthCheck);
});
export default router;
