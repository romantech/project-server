import { analysisController } from '@/controllers';
import { Router } from 'express';

const analysisRouter = Router();

/** 구문 분석 데이터 생성 */
analysisRouter.post('/', ...analysisController.createAnalysis);

/** 잔여 요청 횟수 */
analysisRouter.get(
  '/remaining-counts',
  ...analysisController.getRemainingCounts,
);

/** 랜덤 영어 문장 생성 */
analysisRouter.get(
  '/random-sentences',
  ...analysisController.getRandomSentences,
);

export { analysisRouter };
