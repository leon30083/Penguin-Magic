import { createGLMProvider } from './provider';
import type { GLMModel } from './models';

/**
 * GLM 配置接口
 */
export interface GLMConfig {
  provider: ReturnType<typeof createGLMProvider>;
  model: GLMModel;
}

/**
 * 从环境变量加载 GLM 配置
 *
 * 支持的环境变量:
 * - GLM_API_KEY: API 密钥（必需）
 * - GLM_MODEL: 模型名称（可选，默认 glm-4.7）
 * - GLM_BASE_URL: API 基础 URL（可选）
 *
 * @returns GLM 配置对象
 *
 * @throws {Error} 如果 GLM_API_KEY 未设置
 *
 * @example
 * ```ts
 * import { loadConfigFromEnv } from 'glm-coding-skill';
 *
 * const { provider, model } = loadConfigFromEnv();
 *
 * const result = await streamText({
 *   model: provider(model),
 *   prompt: 'Hello, GLM!',
 * });
 * ```
 */
export function loadConfigFromEnv(): GLMConfig {
  const apiKey = process.env.GLM_API_KEY;
  const baseURL = process.env.GLM_BASE_URL;
  const model = (process.env.GLM_MODEL || 'glm-4.7') as GLMModel;

  if (!apiKey) {
    throw new Error(
      'GLM_API_KEY environment variable is not set. ' +
      'Get your API key from https://open.bigmodel.cn/usercenter/apikeys'
    );
  }

  return {
    provider: createGLMProvider({ apiKey, baseURL }),
    model,
  };
}

/**
 * 创建 GLM 配置（使用指定的 API Key）
 *
 * @param apiKey - API 密钥
 * @param options - 可选配置
 * @returns GLM 配置对象
 *
 * @example
 * ```ts
 * import { createConfig } from 'glm-coding-skill';
 *
 * const { provider, model } = createConfig('your-api-key', {
 *   model: 'glm-4.6',
 *   baseURL: 'https://custom-endpoint.com',
 * });
 * ```
 */
export function createConfig(
  apiKey: string,
  options: {
    model?: GLMModel;
    baseURL?: string;
  } = {}
): GLMConfig {
  const { model = 'glm-4.7', baseURL } = options;

  return {
    provider: createGLMProvider({ apiKey, baseURL }),
    model,
  };
}
