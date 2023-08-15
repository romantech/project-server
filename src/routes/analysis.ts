import { analysisController } from '@/controllers';
import { Router } from 'express';

export enum AnalysisRoutes {
  ANALYSIS = '/',
  RANDOM_SENTENCES = '/random-sentences',
  REMAINING_COUNTS = '/remaining-counts',
}

const analysisRouter = Router();

/** 구문 분석 데이터 생성 */
analysisRouter.post(
  AnalysisRoutes.ANALYSIS,
  ...analysisController.createAnalysis,
);

/** 잔여 요청 횟수 */
analysisRouter.get(
  AnalysisRoutes.REMAINING_COUNTS,
  ...analysisController.getRemainingCounts,
);

/** 랜덤 영어 문장 생성 */
analysisRouter.get(
  AnalysisRoutes.RANDOM_SENTENCES,
  ...analysisController.getRandomSentences,
);

export { analysisRouter };
