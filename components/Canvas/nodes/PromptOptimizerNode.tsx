import React, { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, Connection } from '@xyflow/react';
import type { CanvasNodeData } from '../index';
import { useTheme } from '../../../contexts/ThemeContext';
import { X, Wand2, Copy, RefreshCw } from 'lucide-react';
import { optimizePrompt as optimizePromptWithGLM } from '../../../services/glmService';

// 优化风格模板
const OPTIMIZE_STYLES = [
  { id: 'default', label: '通用', description: '平衡的优化' },
  { id: 'detailed', label: '详细', description: '更多细节描述' },
  { id: 'artistic', label: '艺术', description: '强调艺术风格' },
  { id: 'photorealistic', label: '写实', description: '照片级真实感' },
  { id: 'anime', label: '动漫', description: '动漫风格' },
  { id: 'cinematic', label: '电影', description: '电影镜头感' },
];

const PromptOptimizerNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { theme } = useTheme();
  const nodeData = data as CanvasNodeData;

  const [inputPrompt, setInputPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从连接的数据获取输入
  const connectedPrompt = (nodeData.connectedPrompts?.[0] as string) || '';

  useEffect(() => {
    if (connectedPrompt && connectedPrompt !== inputPrompt) {
      setInputPrompt(connectedPrompt);
    }
  }, [connectedPrompt, inputPrompt]);

  // 优化提示词
  const handleOptimize = useCallback(async () => {
    const promptToOptimize = inputPrompt || connectedPrompt;
    if (!promptToOptimize) {
      setError('请先输入或连接提示词');
      return;
    }

    setIsOptimizing(true);
    setError(null);
    setOptimizedPrompt('');

    try {
      const style = OPTIMIZE_STYLES.find(s => s.id === selectedStyle)?.description;
      const result = await optimizePromptWithGLM(promptToOptimize, style);
      setOptimizedPrompt(result);
      nodeData.onEdit?.(id, { optimizedPrompt: result, originalPrompt: promptToOptimize });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsOptimizing(false);
    }
  }, [inputPrompt, connectedPrompt, selectedStyle, id, nodeData]);

  // 复制到剪贴板
  const handleCopy = useCallback(() => {
    if (optimizedPrompt) {
      navigator.clipboard.writeText(optimizedPrompt);
    }
  }, [optimizedPrompt]);

  // 删除节点
  const handleDelete = useCallback(() => {
    nodeData.onDelete?.(id);
  }, [id, nodeData]);

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all backdrop-blur-xl min-w-[260px] max-w-[320px]`}
      style={{
        borderColor: selected ? '#a78bfa' : 'rgba(167, 139, 250, 0.4)',
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(167, 139, 250, 0.1))',
        boxShadow: selected ? '0 10px 40px -10px rgba(167, 139, 250, 0.4)' : '0 4px 20px -4px rgba(0,0,0,0.5)',
      }}
    >
      {/* 输入连接点 */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-purple-400 !border-2 !border-purple-600 hover:!scale-125 transition-transform"
      />

      {/* 节点头部 */}
      <div
        className="px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}
      >
        <span className="text-lg">✨</span>
        <span className="text-sm font-bold text-purple-300 flex-1">提示词优化</span>
        <button
          onClick={handleDelete}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-gray-500/30 flex items-center justify-center text-gray-400 hover:text-gray-300 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 优化风格选择 */}
      <div className="p-3">
        <div className="text-xs text-gray-400 mb-2">优化风格</div>
        <div className="grid grid-cols-3 gap-1.5">
          {OPTIMIZE_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`px-2 py-1.5 rounded-lg text-xs transition-all ${
                selectedStyle === style.id
                  ? 'bg-purple-500/40 text-purple-200 border border-purple-400/50'
                  : 'bg-black/20 text-gray-400 border border-transparent hover:bg-black/30 hover:border-purple-500/30'
              }`}
              title={style.description}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* 输入提示词 */}
      <div className="px-3 pb-2">
        <div className="text-xs text-gray-400 mb-1.5">输入提示词</div>
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="输入提示词或从左侧节点连接..."
          className="w-full h-16 bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-400 transition-colors"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* 优化按钮 */}
      <div className="px-3 pb-2">
        <button
          onClick={handleOptimize}
          disabled={isOptimizing || !inputPrompt}
          className="w-full py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isOptimizing
              ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(167, 139, 250, 0.2))'
              : 'linear-gradient(135deg, rgba(167, 139, 250, 0.5), rgba(139, 92, 246, 0.4))',
            border: '1px solid rgba(167, 139, 250, 0.4)',
          }}
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              优化中...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              优化提示词
            </>
          )}
        </button>
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="px-3 pb-2">
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        </div>
      )}

      {/* 优化结果 */}
      {optimizedPrompt && (
        <div className="px-3 pb-3">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-purple-300">优化结果</div>
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-purple-500/20 transition-colors"
                title="复制"
              >
                <Copy className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>
            <div className="text-xs text-white whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto">
              {optimizedPrompt}
            </div>
          </div>
        </div>
      )}

      {/* 输出连接点 */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-purple-400 !border-2 !border-purple-600 hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default memo(PromptOptimizerNode);
