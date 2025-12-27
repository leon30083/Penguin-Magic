import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { XCircleIcon } from '../icons/XCircleIcon';
import { CharacterLab } from './CharacterLab';
import { VideoStudio } from './VideoStudio';

interface SoraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoraModal: React.FC<SoraModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'character' | 'video'>('character');

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden border"
        style={{ 
          backgroundColor: theme.bgSecondary,
          borderColor: theme.border,
          color: theme.textPrimary 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border }}>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">🐧 Sora 2 Studio v2.0</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/10 transition-colors"
          >
            <XCircleIcon size={24} color={theme.textSecondary} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: theme.border }}>
          <button
            onClick={() => setActiveTab('character')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'character' 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 hover:bg-black/5'
            }`}
          >
            角色实验室 (Character Lab)
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'video' 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 hover:bg-black/5'
            }`}
          >
            视频工坊 (Video Studio)
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'character' ? (
            <CharacterLab onSwitchTab={(tab) => setActiveTab(tab)} />
          ) : (
            <VideoStudio onSwitchTab={(tab) => setActiveTab(tab)} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
