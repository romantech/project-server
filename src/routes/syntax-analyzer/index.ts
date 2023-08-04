import { syntaxAnalyzerController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/', syntaxAnalyzerController.createAnalysis); // 분석 데이터 생성
router.get('/remaining', syntaxAnalyzerController.getRemaining); // 금일 남은 요청 횟수
router.get('/remaining/:visitorId', syntaxAnalyzerController.getRemainingById); // 특정 사용자의 요청 남은 횟수

export default router;
