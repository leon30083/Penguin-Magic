import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { XCircleIcon } from '../icons/XCircleIcon';
import { CharacterLab } from './CharacterLab';
import { VideoStudio } from './VideoStudio';
import { ProjectList } from './ProjectList';
import { ProjectDetail } from './ProjectDetail';
import { Project } from '../../services/api/projects';

interface SoraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoraModal: React.FC<SoraModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'character' | 'project'>('project');
  const [projectStep, setProjectStep] = useState<'list' | 'detail' | 'create_video'>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleTabChange = (tab: 'character' | 'project') => {
    setActiveTab(tab);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden border"
        style={{ 
          backgroundColor: theme.colors.bgSecondary,
          borderColor: theme.colors.border,
          color: theme.colors.textPrimary 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.colors.border }}>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">🐧 Sora 2 Studio v2.0</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/10 transition-colors"
          >
            <XCircleIcon size={24} color={theme.colors.textSecondary} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: theme.colors.border }}>
          <button
            onClick={() => handleTabChange('project')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'project' 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 hover:bg-black/5'
            }`}
          >
            项目管理 (Project Manager)
          </button>
          <button
            onClick={() => handleTabChange('character')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'character' 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 hover:bg-black/5'
            }`}
          >
            角色实验室 (Character Lab)
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'character' ? (
            <CharacterLab onSwitchTab={() => handleTabChange('project')} />
          ) : (
            <>
                {projectStep === 'list' && (
                    <ProjectList onSelectProject={(p) => {
                        setSelectedProject(p);
                        setProjectStep('detail');
                    }} />
                )}
                {projectStep === 'detail' && selectedProject && (
                    <ProjectDetail 
                        project={selectedProject} 
                        onBack={() => setProjectStep('list')}
                        onCreateVideo={() => setProjectStep('create_video')}
                    />
                )}
                {projectStep === 'create_video' && selectedProject && (
                    <VideoStudio 
                        projectId={selectedProject.id}
                        onBackToProject={() => setProjectStep('detail')}
                        onSwitchTab={() => handleTabChange('character')}
                    />
                )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
