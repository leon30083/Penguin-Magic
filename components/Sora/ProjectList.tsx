import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getProjects, createProject, Project, deleteProject } from '../../services/api/projects';
import { RefreshIcon } from '../icons/RefreshIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject }) => {
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    const res = await getProjects();
    if (res.success && res.data) {
      setProjects(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    setCreating(true);
    const res = await createProject(newProjectName, newProjectDesc);
    setCreating(false);
    
    if (res.success) {
        setShowCreateModal(false);
        setNewProjectName('');
        setNewProjectDesc('');
        loadProjects();
    } else {
        alert('Failed to create project: ' + res.error);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const res = await deleteProject(id);
    if (res.success) {
        loadProjects();
    } else {
        alert('Failed to delete project: ' + res.error);
    }
  };

  return (
    <div style={{ padding: '20px', height: '100%', overflowY: 'auto', color: theme.colors.textPrimary }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>My Projects</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                onClick={loadProjects}
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
                onClick={() => setShowCreateModal(true)}
                style={{
                    background: theme.colors.accent,
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600
                }}
            >
                + New Project
            </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.textSecondary }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: theme.colors.textSecondary, border: `2px dashed ${theme.colors.border}`, borderRadius: '12px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <p>No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {projects.map(project => (
                <div 
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    style={{
                        background: theme.colors.bgPrimary,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        position: 'relative'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{project.name}</h3>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: theme.colors.textSecondary, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {project.description || 'No description'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: theme.colors.textSecondary }}>
                        <span>{project.videoCount || 0} Videos</span>
                        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <button
                        onClick={(e) => handleDeleteProject(e, project.id)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: theme.colors.textSecondary,
                            cursor: 'pointer',
                            opacity: 0.6
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                    >
                        <TrashIcon size={16} />
                    </button>
                </div>
            ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: theme.colors.bgSecondary,
                padding: '24px',
                borderRadius: '12px',
                width: '400px',
                border: `1px solid ${theme.colors.border}`,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <h3 style={{ marginTop: 0, color: theme.colors.textPrimary }}>Create New Project</h3>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: theme.colors.textSecondary }}>Project Name</label>
                    <input 
                        type="text" 
                        value={newProjectName}
                        onChange={e => setNewProjectName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: `1px solid ${theme.colors.border}`,
                            background: theme.colors.bgTertiary,
                            color: theme.colors.textPrimary,
                            outline: 'none'
                        }}
                        placeholder="e.g., Garbage Truck Animation"
                    />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: theme.colors.textSecondary }}>Description (Optional)</label>
                    <textarea 
                        value={newProjectDesc}
                        onChange={e => setNewProjectDesc(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: `1px solid ${theme.colors.border}`,
                            background: theme.colors.bgTertiary,
                            color: theme.colors.textPrimary,
                            minHeight: '80px',
                            outline: 'none'
                        }}
                        placeholder="Brief description of the project..."
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                        onClick={() => setShowCreateModal(false)}
                        style={{
                            background: 'transparent',
                            border: `1px solid ${theme.colors.border}`,
                            color: theme.colors.textPrimary,
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateProject}
                        disabled={creating}
                        style={{
                            background: theme.colors.accent,
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            opacity: creating ? 0.7 : 1
                        }}
                    >
                        {creating ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
