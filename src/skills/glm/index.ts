// Core exports
export { createGLMProvider, DEFAULT_GLM_CONFIG } from './provider';
export type { GLMProviderConfig } from './provider';

export { DEFAULT_MODEL, MODEL_RECOMMENDATIONS, isValidGLMModel, getModelRecommendation } from './models';
export type { GLMModel } from './models';

export { loadConfigFromEnv, createConfig } from './config';
export type { GLMConfig } from './config';

// Convenience functions
import { streamText, generateText } from 'ai';
import { createGLMProvider } from './provider';
import type { GLMModel } from './models';

/**
 * 快速流式生成
 *
 * 便捷函数，用于快速发起流式生成请求。
 *
 * @param prompt - 用户提示词
 * @param options - 配置选项
 * @returns 流式文本生成结果
 *
 * @example
 * ```ts
 * import { streamGLM } from 'glm-coding-skill';
 *
 * const result = await streamGLM('Write a React component', {
 *   apiKey: process.env.GLM_API_KEY!,
 *   system: 'You are a coding expert.',
 *   model: 'glm-4.7',
 * });
 *
 * for await (const chunk of result.textStream) {
 *   process.stdout.write(chunk);
 * }
 * ```
 */
export async function streamGLM(
  prompt: string,
  options: {
    system?: string;
    model?: GLMModel;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    apiKey: string;
    baseURL?: string;
  }
) {
  const glm = createGLMProvider({ apiKey: options.apiKey, baseURL: options.baseURL });
  const model = options.model || 'glm-4.7';

  return streamText({
    model: glm(model),
    prompt,
    system: options.system,
    temperature: options.temperature ?? 0.7,
    maxTokens: options.maxTokens,
    topP: options.topP,
  });
}

/**
 * 快速非流式生成
 *
 * 便捷函数，用于快速发起非流式生成请求。
 *
 * @param prompt - 用户提示词
 * @param options - 配置选项
 * @returns 文本生成结果
 *
 * @example
 * ```ts
 * import { generateGLM } from 'glm-coding-skill';
 *
 * const result = await generateGLM('Write a hello world function', {
 *   apiKey: process.env.GLM_API_KEY!,
 *   model: 'glm-4.7',
 * });
 *
 * console.log(result.text);
 * ```
 */
export async function generateGLM(
  prompt: string,
  options: {
    system?: string;
    model?: GLMModel;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    apiKey: string;
    baseURL?: string;
  }
) {
  const glm = createGLMProvider({ apiKey: options.apiKey, baseURL: options.baseURL });
  const model = options.model || 'glm-4.7';

  return generateText({
    model: glm(model),
    prompt,
    system: options.system,
    temperature: options.temperature ?? 0.7,
    maxTokens: options.maxTokens,
    topP: options.topP,
  });
}
