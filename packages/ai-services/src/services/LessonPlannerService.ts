import { createChatCompletion, MODEL_CONFIGS } from '../config/openai';
import { logger } from '../utils/logger';
import { GradeLevel, Lesson, CurriculumStandard, DifficultyLevel } from '@teachme/shared';
import { LESSON_PLANNING_PROMPTS } from '../prompts/lessonPlanning';

export interface LessonPlanRequest {
  subject: string;
  gradeLevel: GradeLevel;
  topic: string;
  duration: number; // in minutes
  learningObjectives?: string[];
  standards?: CurriculumStandard[];
  difficulty?: DifficultyLevel;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing';
  includeAssessment?: boolean;
  includeActivities?: boolean;
  customRequirements?: string;
}

export interface LessonPlanResponse {
  lesson: Partial<Lesson>;
  confidence: number;
  suggestions: string[];
  metadata: {
    generationTime: number;
    tokensUsed: number;
    model: string;
  };
}

export class LessonPlannerService {
  async generateLessonPlan(request: LessonPlanRequest): Promise<LessonPlanResponse> {
    const startTime = Date.now();
    
    try {
      logger.info('Generating lesson plan', { request });

      // Build the prompt based on the request
      const prompt = this.buildLessonPlanPrompt(request);
      
      // Create chat completion
      const response = await createChatCompletion(
        [
          {
            role: 'system',
            content: LESSON_PLANNING_PROMPTS.SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        MODEL_CONFIGS.LESSON_PLANNING
      );

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from AI');
      }

      // Parse the AI response
      const lessonPlan = this.parseLessonPlanResponse(content, request);
      
      const generationTime = Date.now() - startTime;
      const tokensUsed = response.usage?.total_tokens || 0;

      logger.info('Lesson plan generated successfully', {
        subject: request.subject,
        gradeLevel: request.gradeLevel,
        topic: request.topic,
        generationTime,
        tokensUsed,
      });

      return {
        lesson: lessonPlan,
        confidence: this.calculateConfidence(response),
        suggestions: this.generateSuggestions(request, lessonPlan),
        metadata: {
          generationTime,
          tokensUsed,
          model: MODEL_CONFIGS.LESSON_PLANNING.model,
        },
      };
    } catch (error) {
      logger.error('Lesson plan generation failed:', error);
      throw new Error('Failed to generate lesson plan');
    }
  }

  async generateLessonVariations(
    baseLessonPlan: Partial<Lesson>,
    variationType: 'difficulty' | 'learning_style' | 'duration' | 'activities'
  ): Promise<Partial<Lesson>[]> {
    try {
      const prompt = this.buildVariationPrompt(baseLessonPlan, variationType);
      
      const response = await createChatCompletion(
        [
          {
            role: 'system',
            content: LESSON_PLANNING_PROMPTS.VARIATION_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        MODEL_CONFIGS.LESSON_PLANNING
      );

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No variations generated from AI');
      }

      return this.parseVariationsResponse(content);
    } catch (error) {
      logger.error('Lesson variation generation failed:', error);
      throw new Error('Failed to generate lesson variations');
    }
  }

  async enhanceLessonPlan(
    lessonPlan: Partial<Lesson>,
    enhancementType: 'accessibility' | 'engagement' | 'technology' | 'differentiation'
  ): Promise<Partial<Lesson>> {
    try {
      const prompt = this.buildEnhancementPrompt(lessonPlan, enhancementType);
      
      const response = await createChatCompletion(
        [
          {
            role: 'system',
            content: LESSON_PLANNING_PROMPTS.ENHANCEMENT_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        MODEL_CONFIGS.LESSON_PLANNING
      );

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No enhancement generated from AI');
      }

      return this.parseEnhancementResponse(content, lessonPlan);
    } catch (error) {
      logger.error('Lesson enhancement failed:', error);
      throw new Error('Failed to enhance lesson plan');
    }
  }

  private buildLessonPlanPrompt(request: LessonPlanRequest): string {
    const {
      subject,
      gradeLevel,
      topic,
      duration,
      learningObjectives,
      standards,
      difficulty,
      learningStyle,
      includeAssessment,
      includeActivities,
      customRequirements,
    } = request;

    let prompt = `Create a comprehensive lesson plan with the following specifications:

Subject: ${subject}
Grade Level: ${gradeLevel}
Topic: ${topic}
Duration: ${duration} minutes
Difficulty Level: ${difficulty || 'intermediate'}`;

    if (learningObjectives && learningObjectives.length > 0) {
      prompt += `\nLearning Objectives:\n${learningObjectives.map(obj => `- ${obj}`).join('\n')}`;
    }

    if (standards && standards.length > 0) {
      prompt += `\nCurriculum Standards:\n${standards.map(std => `- ${std.code}: ${std.title}`).join('\n')}`;
    }

    if (learningStyle) {
      prompt += `\nPreferred Learning Style: ${learningStyle}`;
    }

    if (includeAssessment) {
      prompt += '\nInclude assessment activities and rubrics.';
    }

    if (includeActivities) {
      prompt += '\nInclude engaging hands-on activities and interactive elements.';
    }

    if (customRequirements) {
      prompt += `\nAdditional Requirements: ${customRequirements}`;
    }

    prompt += '\n\nPlease provide a detailed lesson plan in JSON format with all necessary components.';

    return prompt;
  }

  private buildVariationPrompt(lessonPlan: Partial<Lesson>, variationType: string): string {
    return `Based on the following lesson plan, create 3 variations focusing on ${variationType}:

Original Lesson Plan:
${JSON.stringify(lessonPlan, null, 2)}

Please provide the variations in JSON format.`;
  }

  private buildEnhancementPrompt(lessonPlan: Partial<Lesson>, enhancementType: string): string {
    return `Enhance the following lesson plan by adding ${enhancementType} features:

Current Lesson Plan:
${JSON.stringify(lessonPlan, null, 2)}

Please provide the enhanced lesson plan in JSON format.`;
  }

  private parseLessonPlanResponse(content: string, request: LessonPlanRequest): Partial<Lesson> {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Ensure required fields are present
      return {
        title: parsed.title || `${request.subject} - ${request.topic}`,
        description: parsed.description || '',
        subject: request.subject,
        gradeLevel: request.gradeLevel,
        duration: request.duration,
        objectives: parsed.objectives || parsed.learningObjectives || [],
        content: parsed.content || {
          introduction: parsed.introduction || '',
          mainContent: parsed.mainContent || [],
          conclusion: parsed.conclusion || '',
          vocabulary: parsed.vocabulary || [],
        },
        activities: parsed.activities || [],
        assessments: parsed.assessments || [],
        resources: parsed.resources || [],
        standards: request.standards || [],
        difficulty: request.difficulty || DifficultyLevel.INTERMEDIATE,
        tags: parsed.tags || [request.subject, request.topic],
        isPublic: false,
      };
    } catch (error) {
      logger.error('Failed to parse lesson plan response:', error);
      
      // Fallback: create a basic lesson plan structure
      return {
        title: `${request.subject} - ${request.topic}`,
        description: content.substring(0, 500),
        subject: request.subject,
        gradeLevel: request.gradeLevel,
        duration: request.duration,
        objectives: [],
        content: {
          introduction: '',
          mainContent: [],
          conclusion: '',
          vocabulary: [],
        },
        activities: [],
        assessments: [],
        resources: [],
        standards: request.standards || [],
        difficulty: request.difficulty || DifficultyLevel.INTERMEDIATE,
        tags: [request.subject, request.topic],
        isPublic: false,
      };
    }
  }

  private parseVariationsResponse(content: string): Partial<Lesson>[] {
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in variations response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('Failed to parse variations response:', error);
      return [];
    }
  }

  private parseEnhancementResponse(content: string, originalLesson: Partial<Lesson>): Partial<Lesson> {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in enhancement response');
      }

      const enhanced = JSON.parse(jsonMatch[0]);
      return { ...originalLesson, ...enhanced };
    } catch (error) {
      logger.error('Failed to parse enhancement response:', error);
      return originalLesson;
    }
  }

  private calculateConfidence(response: any): number {
    // Simple confidence calculation based on response quality
    const content = response.choices[0]?.message?.content || '';
    const hasStructure = content.includes('{') && content.includes('}');
    const hasContent = content.length > 100;
    const finishReason = response.choices[0]?.finish_reason;
    
    let confidence = 0.5; // Base confidence
    
    if (hasStructure) confidence += 0.2;
    if (hasContent) confidence += 0.2;
    if (finishReason === 'stop') confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private generateSuggestions(request: LessonPlanRequest, lessonPlan: Partial<Lesson>): string[] {
    const suggestions: string[] = [];
    
    if (!request.includeAssessment) {
      suggestions.push('Consider adding assessment activities to measure student understanding');
    }
    
    if (!request.includeActivities) {
      suggestions.push('Add interactive activities to increase student engagement');
    }
    
    if (request.duration > 60) {
      suggestions.push('For longer lessons, consider breaking into multiple segments with breaks');
    }
    
    if (!lessonPlan.resources || lessonPlan.resources.length === 0) {
      suggestions.push('Add multimedia resources to support different learning styles');
    }
    
    return suggestions;
  }
}
