import { analysisController } from '@/controllers';
import { Router } from 'express';

const analysisRouter = Router();

analysisRouter.post('/', analysisController.createAnalysis); // 분석 데이터 생성
// router.get('/remaining', syntaxAnalyzerController.getRemaining); // 금일 남은 요청 횟수
analysisRouter.get('/remaining', analysisController.getRemainingCount); // 특정 사용자의  요청 남은 횟수

export { analysisRouter };
