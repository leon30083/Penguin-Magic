import React, { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { CanvasNodeData } from '../index';
import { useTheme } from '../../../contexts/ThemeContext';
import { NarratorItem } from '../../../types';
import { X, Wand2, Copy, RefreshCw, Play } from 'lucide-react';
import { optimizeNarrator, optimizeNarratorBatch } from '../../../services/glmService';

const NarratorProcessorNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { theme } = useTheme();
  const nodeData = data as CanvasNodeData;

  const [inputNarrators, setInputNarrators] = useState<NarratorItem[]>([]);
  const [processedNarrators, setProcessedNarrators] = useState<NarratorItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number>(-1);

  // 从连接获取输入旁白
  const connectedNarrators = (nodeData.connectedNarrators as NarratorItem[]) || [];

  useEffect(() => {
    if (connectedNarrators.length > 0) {
      setInputNarrators(connectedNarrators);
    }
  }, [connectedNarrators]);

  // 处理单行旁白
  const handleProcessOne = useCallback(async (index: number) => {
    const narrator = inputNarrators[index];
    if (!narrator?.text) return;

    setIsProcessing(true);
    setError(null);
    setCurrentProcessingIndex(index);

    try {
      const optimized = await optimizeNarrator(narrator.text);
      const updated = [...processedNarrators];
      updated[index] = {
        ...narrator,
        optimizedText: optimized,
        isOptimized: true,
      };
      setProcessedNarrators(updated);
      nodeData.onEdit?.(id, { processedNarrators: updated });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`优化第 ${index + 1} 行失败: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
      setCurrentProcessingIndex(-1);
    }
  }, [inputNarrators, processedNarrators, id, nodeData]);

  // 批量处理所有旁白
  const handleProcessAll = useCallback(async () => {
    const textsToProcess = inputNarrators.map(n => n.text).filter(t => t);
    if (textsToProcess.length === 0) {
      setError('没有可处理的旁白内容');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const optimizedList = await optimizeNarratorBatch(textsToProcess);
      const updated: NarratorItem[] = inputNarrators.map((narrator, index) => ({
        ...narrator,
        optimizedText: optimizedList[index] || narrator.text,
        isOptimized: true,
      }));
      setProcessedNarrators(updated);
      nodeData.onEdit?.(id, { processedNarrators: updated });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [inputNarrators, id, nodeData]);

  // 复制优化结果
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  // 删除节点
  const handleDelete = useCallback(() => {
    nodeData.onDelete?.(id);
  }, [id, nodeData]);

  const displayNarrators = inputNarrators.length > 0 ? inputNarrators : processedNarrators;

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all backdrop-blur-xl min-w-[300px] max-w-[400px]`}
      style={{
        borderColor: selected ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.1))',
        boxShadow: selected ? '0 10px 40px -10px rgba(245, 158, 11, 0.4)' : '0 4px 20px -4px rgba(0,0,0,0.5)',
      }}
    >
      {/* 输入连接点 */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-orange-400 !border-2 !border-orange-600 hover:!scale-125 transition-transform"
      />

      {/* 节点头部 */}
      <div
        className="px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}
      >
        <span className="text-lg">🎙️</span>
        <span className="text-sm font-bold text-orange-300 flex-1">旁白处理</span>
        <button
          onClick={handleDelete}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-gray-500/30 flex items-center justify-center text-gray-400 hover:text-gray-300 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 操作按钮 */}
      <div className="p-3 flex gap-2">
        <button
          onClick={handleProcessAll}
          disabled={isProcessing || displayNarrators.length === 0}
          className="flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(217, 119, 6, 0.3))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
          }}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              处理中...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              全部优化
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

      {/* 旁白列表 */}
      <div className="px-3 pb-3 max-h-[250px] overflow-y-auto space-y-2">
        {displayNarrators.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            从左侧旁白节点连接输入...
          </div>
        ) : (
          displayNarrators.map((narrator, index) => (
            <div
              key={narrator.id}
              className="bg-black/30 rounded-xl border border-orange-500/20 overflow-hidden"
            >
              <div className="p-3">
                {/* 原始文本 */}
                <div className="text-xs text-gray-400 mb-1">原始</div>
                <div className="text-xs text-white mb-2 line-clamp-2">
                  {narrator.text}
                </div>

                {/* 优化后文本 */}
                {processedNarrators[index]?.optimizedText ? (
                  <>
                    <div className="text-xs text-green-400 mb-1">优化后</div>
                    <div className="text-xs text-white mb-2 bg-green-500/10 rounded-lg p-2">
                      {processedNarrators[index].optimizedText}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500 italic">尚未优化</div>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleProcessOne(index)}
                    disabled={isProcessing}
                    className="flex-1 py-1.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1 disabled:opacity-50 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300"
                  >
                    {currentProcessingIndex === index ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3" />
                    )}
                    优化
                  </button>
                  {processedNarrators[index]?.optimizedText && (
                    <button
                      onClick={() => handleCopy(processedNarrators[index].optimizedText!)}
                      className="px-3 py-1.5 rounded-lg text-xs transition-all bg-white/10 hover:bg-white/20 text-gray-300"
                    >
                      复制
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 输出连接点 */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-orange-400 !border-2 !border-orange-600 hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default memo(NarratorProcessorNode);
