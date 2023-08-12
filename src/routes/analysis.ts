import { analysisController } from '@/controllers';
import { Router } from 'express';

const analysisRouter = Router();

/** 영어 구문 분석 데이터 생성 */
analysisRouter.post('/', ...analysisController.createAnalysis);
/** 구문 분석 요청 잔여 횟수 */
analysisRouter.get('/remaining', ...analysisController.getRemainingCount); // 특정 사용자의 분석 요청 남은 횟수
/** 랜덤 영어 문장 생성 */
analysisRouter.get('/random-sentence', ...analysisController.getRandomSentence);

export { analysisRouter };
