import { Router } from 'express';

const robotsRouter = Router();

robotsRouter.get('/robots.txt', (req, res, _next) => {
  res.type('text/plain');
  /*
   * User-agent: * (모든 웹 크롤러)
   * Disallow: / (루트를 포함한 모든 경로에 대한 크롤러 비허용)
   * */
  res.send('User-agent: *\nDisallow: /');
});

export { robotsRouter };
