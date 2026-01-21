/**
 * GLM (智谱清言) API 服务
 * 用于文本优化、提示词优化、旁白处理等功能
 * API 文档: https://open.bigmodel.cn/dev/api
 */

// GLM API 配置存储
interface GLMConfig {
  apiKey: string;
  model: 'glm-4-flash' | 'glm-4-plus' | 'glm-4';
  baseUrl: string;
}

let glmConfig: GLMConfig | null = null;

/**
 * 设置 GLM API 配置
 */
export const setGLMConfig = (config: GLMConfig | null) => {
  glmConfig = config;
  if (config) {
    console.log('[GLM Service] 配置已更新:', { model: config.model });
  } else {
    console.log('[GLM Service] 配置已清除');
  }
};

/**
 * 获取 GLM API 配置
 */
export const getGLMConfig = (): GLMConfig | null => {
  return glmConfig;
};

/**
 * GLM API 请求/响应类型
 */
interface GLMChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GLMChatRequest {
  model: string;
  messages: GLMChatMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface GLMChatResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

/**
 * 带重试机制的 API 调用
 */
const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let lastError: unknown = new Error('Retry attempts failed.');
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
      const isRetriable = errorMessage.includes('503') || errorMessage.includes('overloaded') || errorMessage.includes('unavailable') || errorMessage.includes('timeout');

      if (isRetriable && attempt < maxRetries) {
        console.warn(`[GLM Service] Attempt ${attempt} failed with retriable error. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw lastError;
      }
    }
  }
  throw lastError;
};

/**
 * 基础 GLM API 调用
 */
async function callGLMAPI(
  systemPrompt: string,
  userMessage: string,
  temperature = 0.7,
  maxTokens = 2000
): Promise<string> {
  if (!glmConfig || !glmConfig.apiKey) {
    throw new Error('请先配置 GLM API Key');
  }

  const url = `${glmConfig.baseUrl}/chat/completions`;

  const requestBody: GLMChatRequest = {
    model: glmConfig.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature,
    max_tokens: maxTokens,
    stream: false
  };

  const response = await withRetry(async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${glmConfig.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`GLM API 请求失败 (${res.status}): ${errorText}`);
    }

    return res.json() as Promise<GLMChatResponse>;
  });

  if (response.error) {
    throw new Error(`GLM API 错误: ${response.error.message}`);
  }

  if (response.choices && response.choices.length > 0) {
    return response.choices[0].message.content.trim();
  }

  throw new Error('GLM API 未返回有效响应');
}

// ==================== 公共 API ====================

/**
 * 优化提示词
 * @param prompt - 原始提示词
 * @param style - 优化风格（可选）
 * @returns 优化后的提示词
 */
export async function optimizePrompt(
  prompt: string,
  style?: string
): Promise<string> {
  const systemInstruction = `You are an expert AI image generation prompt engineer. Your task is to optimize and expand user prompts into detailed, high-quality image generation prompts.

Rules:
1. Understand the user's creative intent
2. Expand with relevant details about:
   - Subject characteristics and details
   - Art style and visual aesthetic
   - Lighting and atmosphere
   - Composition and framing
   - Color palette and mood
3. Keep output focused and coherent
4. Output ONLY the optimized prompt, no explanations
5. Match the language of the input
6. Keep concise but descriptive (50-150 words)${style ? `\n7. Style preference: ${style}` : ''}`;

  return callGLMAPI(systemInstruction, `Optimize this prompt:\n\n"""${prompt}"""`);
}

/**
 * 优化旁白
 * @param narrator - 原始旁白文本
 * @returns 优化后的旁白
 */
export async function optimizeNarrator(narrator: string): Promise<string> {
  const systemInstruction = `You are a professional scriptwriter and narrator. Your task is to optimize narrator text for video production.

Rules:
1. Keep the original meaning and tone
2. Make the language more natural and engaging
3. Improve flow and pacing
4. Output ONLY the optimized narrator text
5. Keep the same language as the input`;

  return callGLMAPI(systemInstruction, `Optimize this narrator text:\n\n"""${narrator}"""`);
}

/**
 * 批量优化旁白
 * @param narrators - 旁白数组
 * @returns 优化后的旁白数组
 */
export async function optimizeNarratorBatch(narrators: string[]): Promise<string[]> {
  const results: string[] = [];

  for (let i = 0; i < narrators.length; i++) {
    console.log(`[GLM Service] 优化旁白 ${i + 1}/${narrators.length}...`);
    try {
      const optimized = await optimizeNarrator(narrators[i]);
      results.push(optimized);
    } catch (error) {
      console.error(`[GLM Service] 旁白优化失败 (${i + 1}):`, error);
      // 失败时返回原始文本
      results.push(narrators[i]);
    }
  }

  return results;
}

/**
 * 生成故事板辅助内容
 * @param scenario - 场景描述
 * @returns 故事板内容数组
 */
export async function generateStoryboard(scenario: string): Promise<string[]> {
  const systemInstruction = `You are a professional storyboard artist and video director. Your task is to break down a scenario into a sequence of storyboard frames.

Rules:
1. Create 4-8 storyboard frames based on the scenario
2. Each frame should be a concise visual description (20-40 words)
3. Consider camera angles, composition, and action
4. Output as a JSON array of strings
5. Output ONLY the JSON array, no other text`;

  const response = await callGLMAPI(
    systemInstruction,
    `Generate storyboard frames for:\n\n"""${scenario}"""`,
    0.8,
    1000
  );

  try {
    // 尝试解析 JSON 数组
    const parsed = JSON.parse(response);
    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item));
    }
  } catch {
    // 如果解析失败，按行分割
    return response.split('\n').filter(line => line.trim());
  }

  return [response];
}

/**
 * 扩展文本
 * @param text - 输入文本
 * @param instruction - 扩展指令
 * @returns 扩展后的文本
 */
export async function expandText(
  text: string,
  instruction?: string
): Promise<string> {
  const systemInstruction = `You are a creative writing assistant. Your task is to expand and elaborate on the user's text based on their instructions.

Rules:
1. Maintain the original meaning and tone
2. Add relevant details and depth
3. Keep the text coherent and well-structured
4. Output ONLY the expanded text
5. Match the language of the input`;

  const userMessage = instruction
    ? `Instruction: ${instruction}\n\nText to expand:\n\n"""${text}"""`
    : `Expand this text:\n\n"""${text}"""`;

  return callGLMAPI(systemInstruction, userMessage);
}

/**
 * 翻译文本
 * @param text - 输入文本
 * @param targetLanguage - 目标语言
 * @returns 翻译后的文本
 */
export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  const systemInstruction = `You are a professional translator. Your task is to translate text accurately while preserving meaning and tone.

Rules:
1. Translate accurately to the target language
2. Preserve the original meaning and context
3. Use natural, idiomatic expressions
4. Output ONLY the translated text`;

  return callGLMAPI(
    systemInstruction,
    `Translate to ${targetLanguage}:\n\n"""${text}"""`
  );
}

/**
 * 分析图片并生成描述
 * @param imageBase64 - base64 编码的图片
 * @param instruction - 分析指令
 * @returns 分析结果
 */
export async function analyzeImage(
  imageBase64: string,
  instruction: string
): Promise<string> {
  if (!glmConfig || !glmConfig.apiKey) {
    throw new Error('请先配置 GLM API Key');
  }

  // GLM-4V 支持视觉模型
  const url = `${glmConfig.baseUrl}/chat/completions`;

  const requestBody: GLMChatRequest = {
    model: glmConfig.model === 'glm-4-plus' ? 'glm-4v-plus' : 'glm-4v',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageBase64 } },
          { type: 'text', text: instruction }
        ] as any
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
    stream: false
  };

  const response = await withRetry(async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${glmConfig.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`GLM API 请求失败 (${res.status}): ${errorText}`);
    }

    return res.json() as Promise<GLMChatResponse>;
  });

  if (response.error) {
    throw new Error(`GLM API 错误: ${response.error.message}`);
  }

  if (response.choices && response.choices.length > 0) {
    return response.choices[0].message.content.trim();
  }

  throw new Error('GLM API 未返回有效响应');
}

// ==================== 类型导出 ====================

export type { GLMConfig };
