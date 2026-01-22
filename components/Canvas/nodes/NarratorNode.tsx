import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { CanvasNodeData } from '../index';
import { useTheme } from '../../../contexts/ThemeContext';
import { NarratorItem } from '../../../types';
import { X, Plus, GripVertical, Trash2 } from 'lucide-react';

const NarratorNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { theme } = useTheme();
  const nodeData = data as CanvasNodeData;
  const [narrators, setNarrators] = useState<NarratorItem[]>(
    (nodeData.narrators as NarratorItem[]) || [
      { id: '1', text: '', order: 0 }
    ]
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragItemRef = useRef<HTMLDivElement | null>(null);

  // 添加新旁白行
  const handleAddNarrator = useCallback(() => {
    const newNarrator: NarratorItem = {
      id: Date.now().toString(),
      text: '',
      order: narrators.length,
    };
    const updated = [...narrators, newNarrator];
    setNarrators(updated);
    nodeData.onEdit?.(id, { narrators: updated });
  }, [narrators, id, nodeData]);

  // 删除旁白行
  const handleDeleteNarrator = useCallback((index: number) => {
    if (narrators.length <= 1) return;
    const updated = narrators.filter((_, i) => i !== index).map((n, i) => ({ ...n, order: i }));
    setNarrators(updated);
    nodeData.onEdit?.(id, { narrators: updated });
  }, [narrators, id, nodeData]);

  // 更新旁白文本
  const handleUpdateNarrator = useCallback((index: number, text: string) => {
    const updated = narrators.map((n, i) =>
      i === index ? { ...n, text } : n
    );
    setNarrators(updated);
    nodeData.onEdit?.(id, { narrators: updated });
  }, [narrators, id, nodeData]);

  // 拖拽排序
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...narrators];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, removed);

    setNarrators(updated.map((n, i) => ({ ...n, order: i })));
    setDraggedIndex(index);
  }, [draggedIndex, narrators]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    nodeData.onEdit?.(id, { narrators: narrators.map((n, i) => ({ ...n, order: i })) });
  }, [narrators, id, nodeData]);

  // 删除节点
  const handleDelete = useCallback(() => {
    nodeData.onDelete?.(id);
  }, [id, nodeData]);

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all backdrop-blur-xl min-w-[280px] max-w-[350px]`}
      style={{
        borderColor: selected ? '#fbbf24' : 'rgba(251, 191, 36, 0.4)',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.1))',
        boxShadow: selected ? '0 10px 40px -10px rgba(251, 191, 36, 0.4)' : '0 4px 20px -4px rgba(0,0,0,0.5)',
      }}
    >
      {/* 输入连接点 */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-amber-400 !border-2 !border-amber-600 hover:!scale-125 transition-transform"
      />

      {/* 节点头部 */}
      <div
        className="px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}
      >
        <span className="text-lg">📝</span>
        <span className="text-sm font-bold text-amber-300 flex-1">旁白</span>
        <div className="text-xs text-gray-400">{narrators.length} 行</div>
        <button
          onClick={handleDelete}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-gray-500/30 flex items-center justify-center text-gray-400 hover:text-gray-300 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 旁白列表 */}
      <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
        {narrators.map((narrator, index) => (
          <div
            key={narrator.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative group bg-black/30 rounded-xl border transition-all ${
              draggedIndex === index
                ? 'border-amber-400/50 opacity-50'
                : 'border-amber-500/20 hover:border-amber-500/40'
            }`}
          >
            {/* 拖拽手柄 */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-50 transition-opacity">
              <GripVertical className="w-4 h-4 text-gray-500" />
            </div>

            {/* 序号和输入 */}
            <div className="flex items-center gap-2 pl-8 pr-2 py-2">
              <span className="text-xs text-amber-400 font-mono w-5">{index + 1}</span>
              <input
                type="text"
                value={narrator.text}
                onChange={(e) => handleUpdateNarrator(index, e.target.value)}
                placeholder="输入旁白内容..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              {narrators.length > 1 && (
                <button
                  onClick={() => handleDeleteNarrator(index)}
                  className="p-1 rounded hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              )}
            </div>

            {/* 优化标记 */}
            {narrator.isOptimized && (
              <div className="absolute right-2 bottom-1">
                <span className="text-xs text-green-400">✓ 已优化</span>
              </div>
            )}
          </div>
        ))}

        {/* 添加按钮 */}
        <button
          onClick={handleAddNarrator}
          className="w-full py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-dashed border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-300"
        >
          <Plus className="w-4 h-4" />
          添加旁白行
        </button>
      </div>

      {/* 统计信息 */}
      <div className="px-3 pb-3">
        <div className="bg-black/20 rounded-lg px-3 py-2 text-xs text-gray-400 flex items-center justify-between">
          <span>总字符: {narrators.reduce((sum, n) => sum + n.text.length, 0)}</span>
          <span>
            已优化: {narrators.filter(n => n.isOptimized).length} / {narrators.length}
          </span>
        </div>
      </div>

      {/* 输出连接点 */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-amber-400 !border-2 !border-amber-600 hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default memo(NarratorNode);
