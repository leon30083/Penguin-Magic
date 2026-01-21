import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/**
 * GLM 编程套餐配置选项
 */
export interface GLMProviderConfig {
  /**
   * GLM API Key
   * 从 https://open.bigmodel.cn/usercenter/apikeys 获取
   */
  apiKey: string;

  /**
   * GLM API 基础 URL
   * 默认: https://open.bigmodel.cn/api/coding/paas/v4
   */
  baseURL?: string;

  /**
   * 提供商名称
   * 默认: glm-coding
   */
  name?: string;
}

/**
 * GLM 编程套餐默认配置
 */
export const DEFAULT_GLM_CONFIG = {
  baseURL: 'https://open.bigmodel.cn/api/coding/paas/v4',
  name: 'glm-coding',
} as const;

/**
 * 创建 GLM 编程套餐提供商
 *
 * GLM 编程套餐使用 OpenAI 兼容协议，无需任何模拟或特殊配置。
 * 只需配置 baseURL 和 apiKey 即可直接使用。
 *
 * @param config - 配置选项
 * @returns OpenAI 兼容的语言模型工厂函数
 *
 * @example
 * ```ts
 * import { createGLMProvider } from 'glm-coding-skill';
 * import { streamText } from 'ai';
 *
 * const glm = createGLMProvider({ apiKey: process.env.GLM_API_KEY! });
 *
 * const result = await streamText({
 *   model: glm('glm-4.7'),
 *   prompt: 'Write a React component for a todo list',
 * });
 *
 * console.log(result.text);
 * ```
 *
 * @example
 * ```ts
 * // 自定义 baseURL
 * const glm = createGLMProvider({
 *   apiKey: process.env.GLM_API_KEY!,
 *   baseURL: 'https://custom-endpoint.com/v1',
 * });
 * ```
 */
export function createGLMProvider(config: GLMProviderConfig) {
  const {
    apiKey,
    baseURL = DEFAULT_GLM_CONFIG.baseURL,
    name = DEFAULT_GLM_CONFIG.name
  } = config;

  if (!apiKey) {
    throw new Error(
      'GLM_API_KEY is required. Get your API key from https://open.bigmodel.cn/usercenter/apikeys'
    );
  }

  return createOpenAICompatible({
    name,
    apiKey,
    baseURL,
  });
}
