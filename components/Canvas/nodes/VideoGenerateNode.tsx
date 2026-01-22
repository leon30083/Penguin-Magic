import React, { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { CanvasNodeData } from '../index';
import { useTheme } from '../../../contexts/ThemeContext';
import { Character } from '../../../types';
import { createVideoTask, VideoModel, VideoDuration, VideoAspectRatio } from '../../../services/soraService';
import { X, Video, Play, Clock, Image as ImageIcon, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';

const VideoGenerateNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { theme } = useTheme();
  const nodeData = data as CanvasNodeData;

  // 配置状态
  const [duration, setDuration] = useState<VideoDuration>('10');
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9');
  const [hd, setHd] = useState(false);

  // 输入状态
  const [prompt, setPrompt] = useState('');
  const [connectedCharacters, setConnectedCharacters] = useState<Character[]>([]);
  const [connectedImages, setConnectedImages] = useState<string[]>([]);

  // 任务状态
  const [taskId, setTaskId] = useState<string | null>(nodeData.taskId as string || null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 同步连接数据
  useEffect(() => {
    if (nodeData.connectedPrompt !== undefined) {
      setPrompt(nodeData.connectedPrompt as string);
    }
    if (nodeData.connectedCharacters) {
      setConnectedCharacters(nodeData.connectedCharacters as Character[]);
    }
    if (nodeData.connectedImages) {
      setConnectedImages(nodeData.connectedImages as string[]);
    }
    if (nodeData.taskId) {
      setTaskId(nodeData.taskId as string);
      setStatus('success');
    }
  }, [nodeData]);

  // 轮询任务状态
  useEffect(() => {
    if (!taskId || status !== 'success') return;

    const pollInterval = setInterval(async () => {
      try {
        const { getTaskStatus } = await import('../../../services/soraService');
        const result = await getTaskStatus(taskId);

        if (result.status === 'SUCCESS') {
          setStatus('success');
          clearInterval(pollInterval);
          nodeData.onEdit?.(id, { videoResult: result.data, taskId });
        } else if (result.status === 'FAILURE') {
          setStatus('error');
          setErrorMessage(result.data?.fail_reason || '视频生成失败');
          clearInterval(pollInterval);
        }
        // 其他状态继续轮询
      } catch (error) {
        console.error('[VideoGenerateNode] 轮询任务状态失败:', error);
      }
    }, 10000); // 每10秒轮询一次

    return () => clearInterval(pollInterval);
  }, [taskId, status]);

  // 生成视频
  const handleGenerate = useCallback(async () => {
    const finalPrompt = prompt.trim();
    if (!finalPrompt) {
      setErrorMessage('请输入提示词');
      setStatus('error');
      return;
    }

    setStatus('generating');
    setErrorMessage(null);

    try {
      // 使用 soraService 创建任务
      const resultTaskId = await createVideoTask({
        prompt: finalPrompt,
        model: 'sora-2', // 默认使用 sora-2
        aspectRatio,
        duration: Number(duration),
        hd,
        images: connectedImages,
      });

      setTaskId(resultTaskId);
      setStatus('success');

      // 更新节点数据
      nodeData.onEdit?.(id, { taskId });

      // 触发事件通知其他节点
      window.dispatchEvent(new CustomEvent('video-task-created', {
        detail: { sourceNodeId: id, taskId: resultTaskId }
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(errorMsg);
      setStatus('error');
    }
  }, [prompt, duration, aspectRatio, hd, connectedImages, id, nodeData]);

  // 打开任务详情
  const handleOpenTask = useCallback(() => {
    if (taskId) {
      window.open(`https://ai.t8star.cn/task/${taskId}`, '_blank');
    }
  }, [taskId]);

  // 删除节点
  const handleDelete = useCallback(() => {
    nodeData.onDelete?.(id);
  }, [id, nodeData]);

  // 用户名到别名的映射
  const usernameToAlias = React.useMemo(() => {
    const map: Record<string, string> = {};
    connectedCharacters.forEach(char => {
      map[char.username] = char.alias || char.username;
    });
    return map;
  }, [connectedCharacters]);

  // 将真实提示词转换为显示提示词（显示别名）
  const realToDisplay = (text: string) => {
    if (!text) return '';
    let result = text;
    Object.entries(usernameToAlias).forEach(([username, alias]) => {
      const regex = new RegExp(`@${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s|$|@)`, 'g');
      result = result.replace(regex, `@${alias}`);
    });
    return result;
  };

  // 将显示提示词转换为真实提示词（API使用真实用户名）
  const displayToReal = (text: string) => {
    if (!text) return '';
    let result = text;
    const sortedAliases = Object.entries(usernameToAlias)
      .sort((a, b) => b[1].length - a[1].length);
    sortedAliases.forEach(([username, alias]) => {
      const regex = new RegExp(`@${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s|$|@)`, 'g');
      result = result.replace(regex, `@${username}`);
    });
    return result;
  };

  // 插入角色引用到光标位置
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const insertCharacterRef = useCallback((username: string, alias: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const displayText = realToDisplay(prompt);
    const refText = `@${alias} `;
    const newDisplayText = displayText.substring(0, start) + refText + displayText.substring(end);
    const newRealText = displayToReal(newDisplayText);
    setPrompt(newRealText);
    setTimeout(() => {
      textareaRef.current?.setSelectionRange(start + refText.length, start + refText.length);
      textareaRef.current?.focus();
    }, 0);
  }, [prompt, usernameToAlias]);

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all backdrop-blur-xl min-w-[300px] max-w-[400px]`}
      style={{
        borderColor: selected ? '#10b981' : 'rgba(16, 185, 129, 0.4)',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.1))',
        boxShadow: selected ? '0 10px 40px -10px rgba(16, 185, 129, 0.4)' : '0 4px 20px -4px rgba(0,0,0,0.5)',
      }}
    >
      {/* 输入连接点 */}
      <Handle
        type="target"
        position={Position.Left}
        id="prompt-input"
        className="!w-4 !h-4 !bg-emerald-400 !border-2 !border-emerald-600 hover:!scale-125 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="character-input"
        className="!w-4 !h-4 !bg-orange-400 !border-2 !border-orange-600 hover:!scale-125 transition-transform"
        style={{ top: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="images-input"
        className="!w-4 !h-4 !bg-purple-400 !border-2 !border-purple-600 hover:!scale-125 transition-transform"
        style={{ top: '60%' }}
      />

      {/* 节点头部 */}
      <div
        className="px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}
      >
        <span className="text-lg">🎬</span>
        <span className="text-sm font-bold text-emerald-300 flex-1">视频生成</span>
        <button
          onClick={handleDelete}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-gray-500/30 flex items-center justify-center text-gray-400 hover:text-gray-300 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 配置选项 */}
      <div className="p-3 space-y-2">
        {/* 时长选择 */}
        <div>
          <div className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            视频时长
          </div>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as VideoDuration)}
            disabled={status === 'generating'}
            className="w-full px-3 py-1.5 bg-black/40 border border-emerald-500/30 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="5">5秒</option>
            <option value="10">10秒</option>
            <option value="15">15秒</option>
          </select>
        </div>

        {/* 宽高比选择 */}
        <div>
          <div className="text-xs text-gray-400 mb-1.5">画面比例</div>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as VideoAspectRatio)}
            disabled={status === 'generating'}
            className="w-full px-3 py-1.5 bg-black/40 border border-emerald-500/30 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="16:9">16:9 (横屏)</option>
            <option value="9:16">9:16 (竖屏)</option>
          </select>
        </div>

        {/* 高清选项 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">高清画质</span>
          <button
            onClick={() => setHd(!hd)}
            disabled={status === 'generating'}
            className={`w-10 h-5 rounded-full transition-all ${hd ? 'bg-emerald-500' : 'bg-gray-600'} relative disabled:opacity-50`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hd ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </div>

      {/* 连接的角色 */}
      {connectedCharacters.length > 0 && (
        <div className="px-3 pb-2">
          <div className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            可用角色 (点击插入)
          </div>
          <div className="flex flex-wrap gap-2">
            {connectedCharacters.map((char) => (
              <button
                key={char.id}
                onClick={() => insertCharacterRef(char.username, char.alias || char.username)}
                className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-lg transition-colors"
                title={`点击插入 @${char.alias || char.username}`}
                disabled={status === 'generating'}
                onClick={(e) => e.stopPropagation()}
              >
                {char.profilePictureUrl ? (
                  <img
                    src={char.profilePictureUrl}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <span className="text-xs text-emerald-300">?</span>
                  </div>
                )}
                <span className="text-xs text-emerald-200 truncate max-w-[60px]">
                  {char.alias || char.username}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 连接的图片 */}
      {connectedImages.length > 0 && (
        <div className="px-3 pb-2">
          <div className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            参考图 ({connectedImages.length})
          </div>
          <div className="grid grid-cols-4 gap-1">
            {connectedImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`ref-${index}`}
                className="w-full h-12 object-cover rounded-lg border border-white/10"
              />
            ))}
          </div>
        </div>
      )}

      {/* 提示词输入 */}
      <div className="px-3 pb-2">
        <textarea
          ref={textareaRef}
          value={realToDisplay(prompt)}
          onChange={(e) => {
            const realText = displayToReal(e.target.value);
            setPrompt(realText);
          }}
          placeholder="输入提示词，或从左侧连接文本节点..."
          disabled={status === 'generating'}
          className="w-full h-20 bg-black/40 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 resize-none focus:outline-none focus:border-emerald-400 disabled:opacity-50"
          onClick={(e) => e.stopPropagation()}
        />
        {prompt && (
          <div className="text-xs text-gray-500 mt-1 truncate">
            API: {prompt}
          </div>
        )}
      </div>

      {/* 生成按钮 */}
      <div className="px-3 pb-3">
        <button
          onClick={handleGenerate}
          disabled={status === 'generating' || !prompt}
          className="w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          style={{
            background: status === 'generating'
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.2))'
              : status === 'success'
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : status === 'error'
              ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(5, 150, 105, 0.4))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
          }}
        >
          {status === 'idle' && (
            <>
              <Video className="w-4 h-4" />
              生成视频
            </>
          )}
          {status === 'generating' && (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              生成中...
            </>
          )}
          {status === 'success' && (
            <>
              <Play className="w-4 h-4" />
              已提交
            </>
          )}
          {status === 'error' && (
            <>
              <X className="w-4 h-4" />
              失败
            </>
          )}
        </button>

        {/* 错误显示 */}
        {errorMessage && (
          <div className="mt-2 text-xs text-red-400 text-center">
            {errorMessage}
          </div>
        )}
      </div>

      {/* 任务ID显示 */}
      {taskId && (
        <div className="px-3 pb-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2">
            <div className="text-xs text-emerald-300 mb-1">任务已创建</div>
            <div className="text-xs text-white font-mono break-all">{taskId}</div>
            <button
              onClick={handleOpenTask}
              className="mt-2 text-xs text-emerald-400 flex items-center gap-1 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              查看详情
            </button>
          </div>
        </div>
      )}

      {/* 输出连接点 */}
      <Handle
        type="source"
        position={Position.Right}
        id="video-output"
        className="!w-4 !h-4 !bg-emerald-400 !border-2 !border-emerald-600 hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default memo(VideoGenerateNode);
