/**
 * GLM 编程套餐支持的模型列表
 *
 * @example
 * ```ts
 * import type { GLMModel } from 'glm-coding-skill';
 *
 * const model: GLMModel = 'glm-4.7';
 * ```
 */
export type GLMModel =
  | 'glm-4.7'      // 默认，最强性能
  | 'glm-4.6'      // 高性能
  | 'glm-4.5-air'; // 轻量级，快速响应

/**
 * 默认模型
 */
export const DEFAULT_MODEL: GLMModel = 'glm-4.7';

/**
 * 模型配置建议
 */
export const MODEL_RECOMMENDATIONS = {
  'glm-4.7': {
    description: '最强性能，适合复杂任务',
    useCase: '代码生成、复杂推理、架构设计',
    maxTokens: 128000,
  },
  'glm-4.6': {
    description: '高性能平衡',
    useCase: '一般编程任务、代码审查',
    maxTokens: 128000,
  },
  'glm-4.5-air': {
    description: '轻量快速',
    useCase: '简单问答、快速迭代',
    maxTokens: 128000,
  },
} as const;

/**
 * 验证模型名称是否有效
 */
export function isValidGLMModel(model: string): model is GLMModel {
  return ['glm-4.7', 'glm-4.6', 'glm-4.5-air'].includes(model);
}

/**
 * 获取模型推荐信息
 */
export function getModelRecommendation(model: GLMModel) {
  return MODEL_RECOMMENDATIONS[model];
}
