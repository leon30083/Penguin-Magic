import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getProject, Project, Video } from '../../services/api/projects';
import { RefreshIcon } from '../icons/RefreshIcon';
import { PlayIcon } from '../icons/PlayIcon';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onCreateVideo: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project: initialProject, onBack, onCreateVideo }) => {
  const { theme } = useTheme();
  const [project, setProject] = useState<Project>(initialProject);
  const [loading, setLoading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const loadProject = async () => {
    setLoading(true);
    const res = await getProject(project.id);
    if (res.success && res.data) {
      setProject(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProject();
  }, [initialProject.id]);

  return (
    <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <button 
            onClick={onBack}
            style={{
                background: 'transparent',
                border: 'none',
                color: theme.colors.textSecondary,
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            ← Back
        </button>
        <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, color: theme.colors.textPrimary }}>{project.name}</h2>
            {project.description && (
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: theme.colors.textSecondary }}>{project.description}</p>
            )}
        </div>
        <button 
            onClick={loadProject}
            style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: theme.colors.textSecondary
            }}
        >
            <RefreshIcon />
        </button>
        <button
            onClick={onCreateVideo}
            style={{
                background: theme.colors.primary,
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600
            }}
        >
            + Create Video
        </button>
      </div>

      {/* Video Grid */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.textSecondary }}>Loading videos...</div>
        ) : !project.videos || project.videos.length === 0 ? (
            <div style={{ 
                textAlign: 'center', 
                padding: '60px', 
                color: theme.colors.textSecondary, 
                border: `2px dashed ${theme.colors.border}`,
                borderRadius: '12px',
                margin: '20px'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                <p>No videos in this project yet.</p>
                <button
                    onClick={onCreateVideo}
                    style={{
                        marginTop: '16px',
                        background: 'transparent',
                        border: `1px solid ${theme.colors.primary}`,
                        color: theme.colors.primary,
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Create your first video
                </button>
            </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {project.videos.map(video => (
                    <div 
                        key={video.id}
                        style={{
                            background: theme.colors.bgSecondary,
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
                            {playingVideo === video.id ? (
                                <video 
                                    src={video.url} 
                                    controls 
                                    autoPlay 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <div 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        backgroundImage: `url(${video.url}#t=0.1)`, // Quick hack for thumbnail if supported, otherwise just black
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                    onClick={() => setPlayingVideo(video.id)}
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'rgba(0,0,0,0.6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff'
                                    }}>
                                        <PlayIcon size={24} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '12px' }}>
                            <p style={{ 
                                margin: '0 0 8px 0', 
                                fontSize: '13px', 
                                color: theme.colors.textSecondary,
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                height: '32px'
                            }} title={video.prompt}>
                                {video.prompt}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.colors.textSecondary }}>
                                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                <span>{video.metadata?.duration}s</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
