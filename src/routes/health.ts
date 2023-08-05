import { Router } from 'express';
import requestIP from 'request-ip';

const router = Router();

router.get(['/', '/health'], (req, res, next) => {
  try {
    const request_ip = requestIP.getClientIp(req);

    res.send({
      uptime: process.uptime(),
      message: 'Server is up and running',
      timestamp: Date.now(),
      status: 'OK',
      request_ip,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
