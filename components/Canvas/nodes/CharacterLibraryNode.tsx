import React, { memo, useState, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { CanvasNodeData } from '../index';
import { useTheme } from '../../../contexts/ThemeContext';
import { Character, CharacterPlatformType } from '../../../types';
import { X, Plus, Search, Star, Trash2 } from 'lucide-react';

const PLATFORM_LABELS: Record<CharacterPlatformType, string> = {
  zhenzhen: '贞贞',
  sora: 'Sora',
  runway: 'Runway',
  other: '其他',
};

const CharacterLibraryNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { theme } = useTheme();
  const nodeData = data as CanvasNodeData;
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<CharacterPlatformType | 'all'>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 加载角色列表
  const loadCharacters = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/characters');
      const result = await response.json();
      if (result.success) {
        setCharacters(result.data || []);
        // 如果已有选中角色，恢复选中状态
        if (nodeData.selectedCharacter) {
          const found = result.data.find((c: Character) => c.id === nodeData.selectedCharacter.id);
          if (found) setSelectedCharacter(found);
        }
      }
    } catch (error) {
      console.error('加载角色列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nodeData.selectedCharacter]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  // 筛选角色
  const filteredCharacters = characters.filter(char => {
    const matchSearch =
      !searchQuery ||
      char.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.alias.toLowerCase().includes(searchQuery.toLowerCase());

    const matchPlatform = filterPlatform === 'all' || char.platform === filterPlatform;
    const matchFavorite = !showFavorites || char.isFavorite;

    return matchSearch && matchPlatform && matchFavorite;
  });

  // 选择角色
  const handleSelectCharacter = useCallback((character: Character) => {
    setSelectedCharacter(character);
    nodeData.onEdit?.(id, { selectedCharacter: character });
  }, [id, nodeData]);

  // 删除节点
  const handleDelete = useCallback(() => {
    nodeData.onDelete?.(id);
  }, [id, nodeData]);

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all backdrop-blur-xl min-w-[280px] max-w-[350px]`}
      style={{
        borderColor: selected ? '#f472b6' : 'rgba(244, 114, 182, 0.4)',
        background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.15), rgba(244, 114, 182, 0.1))',
        boxShadow: selected ? '0 10px 40px -10px rgba(244, 114, 182, 0.4)' : '0 4px 20px -4px rgba(0,0,0,0.5)',
      }}
    >
      {/* 输入连接点 */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-pink-400 !border-2 !border-pink-600 hover:!scale-125 transition-transform"
      />

      {/* 节点头部 */}
      <div
        className="px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}
      >
        <span className="text-lg">👤</span>
        <span className="text-sm font-bold text-pink-300 flex-1">角色库</span>
        <button
          onClick={handleDelete}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-gray-500/30 flex items-center justify-center text-gray-400 hover:text-gray-300 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="p-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索角色..."
            className="w-full pl-9 pr-3 py-2 bg-black/40 border border-pink-500/30 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value as CharacterPlatformType | 'all')}
            className="flex-1 px-3 py-1.5 bg-black/40 border border-pink-500/30 rounded-lg text-xs text-white focus:outline-none focus:border-pink-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="all">全部平台</option>
            {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              showFavorites
                ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                : 'bg-black/40 text-gray-400 border border-pink-500/30'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 角色列表 */}
      <div className="px-3 pb-3 max-h-[200px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-6 text-gray-500 text-sm">加载中...</div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">暂无角色</div>
        ) : (
          <div className="space-y-1.5">
            {filteredCharacters.map((char) => (
              <div
                key={char.id}
                onClick={() => handleSelectCharacter(char)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                  selectedCharacter?.id === char.id
                    ? 'bg-pink-500/30 border border-pink-400'
                    : 'bg-black/20 border border-transparent hover:bg-black/30 hover:border-pink-500/30'
                }`}
              >
                {char.profilePictureUrl && (
                  <img
                    src={char.profilePictureUrl}
                    alt={char.username}
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {char.alias || char.username}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {PLATFORM_LABELS[char.platform]}
                  </div>
                </div>
                {char.isFavorite && (
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 已选角色显示 */}
      {selectedCharacter && (
        <div className="px-3 pb-3">
          <div className="bg-pink-500/20 border border-pink-500/40 rounded-lg p-2">
            <div className="text-xs text-pink-300 mb-1">已选择角色</div>
            <div className="flex items-center gap-2">
              {selectedCharacter.profilePictureUrl && (
                <img
                  src={selectedCharacter.profilePictureUrl}
                  alt={selectedCharacter.username}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-white truncate">
                {selectedCharacter.alias || selectedCharacter.username}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 输出连接点 */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-pink-400 !border-2 !border-pink-600 hover:!scale-125 transition-transform"
      />
    </div>
  );
};

export default memo(CharacterLibraryNode);
