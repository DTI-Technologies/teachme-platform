import { createChatCompletion, createStreamingChatCompletion, MODEL_CONFIGS } from '../config/openai';
import { logger } from '../utils/logger';
import { GradeLevel, AIPersonality, AIResponse } from '@teachme/shared';

export interface TutorRequest {
  studentId: string;
  gradeLevel: GradeLevel;
  subject: string;
  question: string;
  context?: {
    currentLesson?: string;
    previousQuestions?: string[];
    studentLevel?: 'beginner' | 'intermediate' | 'advanced';
    learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing';
  };
  personality?: AIPersonality;
  streaming?: boolean;
}

export interface TutorResponse extends AIResponse {
  followUpQuestions: string[];
  hints: string[];
  resources: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  encouragement: string;
}

export class TutorService {
  async provideTutoring(request: TutorRequest): Promise<TutorResponse> {
    try {
      logger.info('Providing AI tutoring', { 
        studentId: request.studentId,
        subject: request.subject,
        gradeLevel: request.gradeLevel 
      });

      const systemPrompt = this.buildSystemPrompt(request);
      const userPrompt = this.buildUserPrompt(request);

      if (request.streaming) {
        return await this.handleStreamingResponse(systemPrompt, userPrompt, request);
      } else {
        return await this.handleRegularResponse(systemPrompt, userPrompt, request);
      }
    } catch (error) {
      logger.error('AI tutoring failed:', error);
      throw new Error('Failed to provide tutoring response');
    }
  }

  async generateHints(question: string, subject: string, gradeLevel: GradeLevel): Promise<string[]> {
    try {
      const prompt = `Generate 3 progressive hints for this ${subject} question for grade ${gradeLevel}:

Question: ${question}

Provide hints that:
1. Start with gentle guidance
2. Become more specific
3. Lead toward the solution without giving it away

Format as a JSON array of strings.`;

      const response = await createChatCompletion(
        [
          {
            role: 'system',
            content: 'You are a helpful tutor who provides progressive hints to guide students toward solutions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        MODEL_CONFIGS.TUTORING
      );

      const content = response.choices[0]?.message?.content;
      if (!content) return [];

      try {
        const hints = JSON.parse(content);
        return Array.isArray(hints) ? hints : [];
      } catch {
        // Fallback: split by lines or numbers
        return content.split('\n').filter(line => line.trim()).slice(0, 3);
      }
    } catch (error) {
      logger.error('Hint generation failed:', error);
      return [];
    }
  }

  async generateFollowUpQuestions(
    originalQuestion: string,
    answer: string,
    subject: string,
    gradeLevel: GradeLevel
  ): Promise<string[]> {
    try {
      const prompt = `Based on this ${subject} question and answer for grade ${gradeLevel}, generate 3 follow-up questions that:

Original Question: ${originalQuestion}
Answer: ${answer}

Follow-up questions should:
1. Build on the current concept
2. Increase in complexity appropriately
3. Encourage deeper thinking
4. Be age-appropriate for grade ${gradeLevel}

Format as a JSON array of strings.`;

      const response = await createChatCompletion(
        [
          {
            role: 'system',
            content: 'You are an educational expert who creates engaging follow-up questions to deepen student understanding.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        MODEL_CONFIGS.TUTORING
      );

      const content = response.choices[0]?.message?.content;
      if (!content) return [];

      try {
        const questions = JSON.parse(content);
        return Array.isArray(questions) ? questions : [];
      } catch {
        return content.split('\n').filter(line => line.trim() && line.includes('?')).slice(0, 3);
      }
    } catch (error) {
      logger.error('Follow-up question generation failed:', error);
      return [];
    }
  }

  async assessDifficulty(question: string, subject: string, gradeLevel: GradeLevel): Promise<'easy' | 'medium' | 'hard'> {
    try {
      const prompt = `Assess the difficulty of this ${subject} question for grade ${gradeLevel}:

Question: ${question}

Rate as: easy, medium, or hard

Consider:
- Grade-level appropriateness
- Concept complexity
- Required prior knowledge
- Problem-solving steps needed

Respond with only one word: easy, medium, or hard`;

      const response = await createChatCompletion(
        [
          {
            role: 'system',
            content: 'You are an educational assessment expert who evaluates question difficulty for students.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        {
          ...MODEL_CONFIGS.TUTORING,
          max_tokens: 10,
        }
      );

      const content = response.choices[0]?.message?.content?.toLowerCase().trim();
      
      if (content?.includes('easy')) return 'easy';
      if (content?.includes('hard')) return 'hard';
      return 'medium';
    } catch (error) {
      logger.error('Difficulty assessment failed:', error);
      return 'medium';
    }
  }

  private buildSystemPrompt(request: TutorRequest): string {
    const { gradeLevel, subject, personality } = request;
    
    let systemPrompt = `You are an AI tutor specializing in ${subject} for grade ${gradeLevel} students. Your role is to:

1. Provide clear, age-appropriate explanations
2. Guide students to discover answers rather than giving them directly
3. Encourage critical thinking and problem-solving
4. Adapt your teaching style to the student's needs
5. Provide positive reinforcement and motivation
6. Break down complex concepts into manageable steps

Teaching Guidelines:
- Use simple, clear language appropriate for grade ${gradeLevel}
- Provide examples and analogies when helpful
- Ask guiding questions to check understanding
- Celebrate progress and effort
- Be patient and encouraging
- Connect new concepts to familiar ideas`;

    if (personality) {
      systemPrompt += `\n\nPersonality Traits:
- Enthusiasm level: ${personality.traits.enthusiasm}/10
- Patience level: ${personality.traits.patience}/10
- Humor level: ${personality.traits.humor}/10
- Formality level: ${personality.traits.formality}/10
- Encouragement level: ${personality.traits.encouragement}/10

Adjust your communication style to match these personality traits.`;
    }

    // Add grade-specific guidelines
    if (['K', '1', '2'].includes(gradeLevel)) {
      systemPrompt += `\n\nFor early elementary students:
- Use very simple language and short sentences
- Include visual descriptions and concrete examples
- Be extra encouraging and patient
- Use playful analogies and stories
- Break everything into tiny steps`;
    } else if (['3', '4', '5'].includes(gradeLevel)) {
      systemPrompt += `\n\nFor late elementary students:
- Use clear but slightly more complex language
- Encourage independent thinking
- Provide step-by-step guidance
- Use real-world examples
- Build confidence through success`;
    } else if (['6', '7', '8'].includes(gradeLevel)) {
      systemPrompt += `\n\nFor middle school students:
- Use more sophisticated vocabulary
- Encourage critical thinking and analysis
- Relate to their interests and experiences
- Provide challenges that build confidence
- Support identity and independence`;
    } else {
      systemPrompt += `\n\nFor high school students:
- Use advanced vocabulary and concepts
- Encourage deep analysis and synthesis
- Connect to real-world applications
- Support college and career preparation
- Respect their developing expertise`;
    }

    return systemPrompt;
  }

  private buildUserPrompt(request: TutorRequest): string {
    const { question, context } = request;
    
    let userPrompt = `Student Question: ${question}`;

    if (context) {
      if (context.currentLesson) {
        userPrompt += `\n\nCurrent Lesson Context: ${context.currentLesson}`;
      }
      
      if (context.previousQuestions && context.previousQuestions.length > 0) {
        userPrompt += `\n\nPrevious Questions in this Session:
${context.previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
      }
      
      if (context.studentLevel) {
        userPrompt += `\n\nStudent Level: ${context.studentLevel}`;
      }
      
      if (context.learningStyle) {
        userPrompt += `\n\nPreferred Learning Style: ${context.learningStyle}`;
      }
    }

    userPrompt += `\n\nPlease provide a helpful, encouraging response that guides the student toward understanding. Include your response in a JSON format with the following structure:
{
  "content": "Your main tutoring response",
  "encouragement": "A brief encouraging message",
  "hints": ["hint1", "hint2", "hint3"],
  "followUpQuestions": ["question1", "question2", "question3"],
  "resources": ["resource1", "resource2"]
}`;

    return userPrompt;
  }

  private async handleRegularResponse(
    systemPrompt: string,
    userPrompt: string,
    request: TutorRequest
  ): Promise<TutorResponse> {
    const response = await createChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      MODEL_CONFIGS.TUTORING
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from AI');
    }

    return this.parseTutorResponse(content, request);
  }

  private async handleStreamingResponse(
    systemPrompt: string,
    userPrompt: string,
    request: TutorRequest
  ): Promise<TutorResponse> {
    // For streaming, we'll collect the full response and then parse it
    // In a real implementation, you might want to stream the response back to the client
    const stream = await createStreamingChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      MODEL_CONFIGS.TUTORING
    );

    let fullContent = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullContent += delta;
      }
    }

    return this.parseTutorResponse(fullContent, request);
  }

  private parseTutorResponse(content: string, request: TutorRequest): TutorResponse {
    try {
      // Try to parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          content: parsed.content || content,
          confidence: 0.8,
          sources: [],
          suggestions: [],
          followUpQuestions: parsed.followUpQuestions || [],
          hints: parsed.hints || [],
          resources: parsed.resources || [],
          difficulty: 'medium',
          encouragement: parsed.encouragement || 'Great question! Keep up the good work!',
        };
      }
    } catch (error) {
      logger.warn('Failed to parse structured tutor response, using fallback');
    }

    // Fallback: return basic response
    return {
      content,
      confidence: 0.6,
      sources: [],
      suggestions: [],
      followUpQuestions: [],
      hints: [],
      resources: [],
      difficulty: 'medium',
      encouragement: 'Keep asking great questions!',
    };
  }
}
