import OpenAI from 'openai';
import { logger } from '../utils/logger';

let openaiClient: OpenAI | null = null;

export const initializeOpenAI = async (): Promise<void> => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not provided');
    }

    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION_ID,
    });

    // Test the connection
    await openaiClient.models.list();
    
    logger.info('OpenAI client initialized successfully');
  } catch (error) {
    logger.error('OpenAI initialization failed:', error);
    throw error;
  }
};

export const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI() first.');
  }
  return openaiClient;
};

// Configuration constants
export const AI_CONFIG = {
  DEFAULT_MODEL: process.env.AI_MODEL_VERSION || 'gpt-4',
  MAX_TOKENS: parseInt(process.env.AI_MAX_TOKENS || '2000'),
  TEMPERATURE: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  TOP_P: 1,
  FREQUENCY_PENALTY: 0,
  PRESENCE_PENALTY: 0,
} as const;

// Model configurations for different use cases
export const MODEL_CONFIGS = {
  LESSON_PLANNING: {
    model: AI_CONFIG.DEFAULT_MODEL,
    temperature: 0.7,
    max_tokens: 3000,
    top_p: 0.9,
  },
  TUTORING: {
    model: AI_CONFIG.DEFAULT_MODEL,
    temperature: 0.8,
    max_tokens: 1500,
    top_p: 0.95,
  },
  ASSESSMENT: {
    model: AI_CONFIG.DEFAULT_MODEL,
    temperature: 0.5,
    max_tokens: 2000,
    top_p: 0.8,
  },
  CONTENT_GENERATION: {
    model: AI_CONFIG.DEFAULT_MODEL,
    temperature: 0.9,
    max_tokens: 2500,
    top_p: 0.95,
  },
  FEEDBACK: {
    model: AI_CONFIG.DEFAULT_MODEL,
    temperature: 0.6,
    max_tokens: 1000,
    top_p: 0.85,
  },
} as const;

// Helper function to create chat completion
export const createChatCompletion = async (
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  config: Partial<OpenAI.Chat.Completions.ChatCompletionCreateParams> = {}
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
  const client = getOpenAIClient();
  
  const defaultConfig = {
    model: AI_CONFIG.DEFAULT_MODEL,
    temperature: AI_CONFIG.TEMPERATURE,
    max_tokens: AI_CONFIG.MAX_TOKENS,
    top_p: AI_CONFIG.TOP_P,
    frequency_penalty: AI_CONFIG.FREQUENCY_PENALTY,
    presence_penalty: AI_CONFIG.PRESENCE_PENALTY,
  };

  try {
    const response = await client.chat.completions.create({
      ...defaultConfig,
      ...config,
      messages,
    });

    return response;
  } catch (error) {
    logger.error('OpenAI chat completion failed:', error);
    throw error;
  }
};

// Helper function to create streaming chat completion
export const createStreamingChatCompletion = async (
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  config: Partial<OpenAI.Chat.Completions.ChatCompletionCreateParams> = {}
): Promise<AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> => {
  const client = getOpenAIClient();
  
  const defaultConfig = {
    model: AI_CONFIG.DEFAULT_MODEL,
    temperature: AI_CONFIG.TEMPERATURE,
    max_tokens: AI_CONFIG.MAX_TOKENS,
    top_p: AI_CONFIG.TOP_P,
    frequency_penalty: AI_CONFIG.FREQUENCY_PENALTY,
    presence_penalty: AI_CONFIG.PRESENCE_PENALTY,
    stream: true,
  };

  try {
    const stream = await client.chat.completions.create({
      ...defaultConfig,
      ...config,
      messages,
    });

    return stream;
  } catch (error) {
    logger.error('OpenAI streaming chat completion failed:', error);
    throw error;
  }
};

// Helper function to create embeddings
export const createEmbedding = async (
  input: string | string[],
  model: string = 'text-embedding-ada-002'
): Promise<OpenAI.Embeddings.CreateEmbeddingResponse> => {
  const client = getOpenAIClient();
  
  try {
    const response = await client.embeddings.create({
      model,
      input,
    });

    return response;
  } catch (error) {
    logger.error('OpenAI embedding creation failed:', error);
    throw error;
  }
};

// Helper function to moderate content
export const moderateContent = async (
  input: string
): Promise<OpenAI.Moderations.ModerationCreateResponse> => {
  const client = getOpenAIClient();
  
  try {
    const response = await client.moderations.create({
      input,
    });

    return response;
  } catch (error) {
    logger.error('OpenAI content moderation failed:', error);
    throw error;
  }
};
