import { setupRoutes } from '@/routes';
import { createServer, PORT } from '@/config';
import { initRedisKeys, redis } from '@/services';
import { errorHandler, notFoundHandler } from '@/middlewares';

/**
 * 배포 환경에선 빌드(ts -> js 파일로 트랜스파일) 후 모든 js 파일이 dist 폴더에 저장됨
 * node -r module-alias/register 명령어는 module-alias/register 모듈을 실행하고,
 * package.json._moduleAliases 속성을 참조해 @ 경로를 dist 폴더로 매핑함.
 * 즉, 모든 import 구문의 @ 경로는 dist 폴더로 변환됨 e.g. @/config -> dist/config
 * src/config 경로로 작성하면 dist 폴더에서 모듈을 찾는게 아니어서 에러 발생하므로 주의
 * */

const initServer = () => {
  const app = createServer();
  app.locals.redis = redis;

  initRedisKeys(redis)
    .then(() => console.log('Redis has been successfully initialized'))
    .catch((err) => console.error('Failed to initialize Redis:', err));

  setupRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

initServer();
