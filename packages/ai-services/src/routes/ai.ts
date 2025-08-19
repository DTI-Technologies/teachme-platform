import { Router } from 'express';
import { TutorService } from '../services/TutorService';
import { LessonPlannerService } from '../services/LessonPlannerService';

const router = Router();
const tutorService = new TutorService();
const lessonPlannerService = new LessonPlannerService();

// Chat/Tutor endpoint
router.post('/chat', async (req, res, next) => {
  try {
    const response = await tutorService.provideTutoring(req.body);
    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

// Lesson plan generation
router.post('/lesson-plan', async (req, res, next) => {
  try {
    const response = await lessonPlannerService.generateLessonPlan(req.body);
    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

// Generate hints
router.post('/hints', async (req, res, next) => {
  try {
    const { question, subject, gradeLevel } = req.body;
    const hints = await tutorService.generateHints(question, subject, gradeLevel);
    res.json({
      success: true,
      data: { hints },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
