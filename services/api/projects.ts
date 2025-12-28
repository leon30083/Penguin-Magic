import { get, post, del, ApiResponse } from './index';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  videoCount: number;
  videos?: Video[];
}

export interface Video {
  id: string;
  projectId: string;
  url: string;
  prompt: string;
  metadata: any;
  createdAt: string;
}

export const getProjects = async (): Promise<ApiResponse<Project[]>> => {
  return get('/projects');
};

export const createProject = async (name: string, description?: string): Promise<ApiResponse<Project>> => {
  return post('/projects', { name, description });
};

export const getProject = async (id: string): Promise<ApiResponse<Project>> => {
  return get(`/projects/${id}`);
};

export const deleteProject = async (id: string): Promise<ApiResponse<void>> => {
  return del(`/projects/${id}`);
};

export const addVideoToProject = async (projectId: string, videoData: { url: string; prompt: string; taskId: string; metadata?: any }): Promise<ApiResponse<Video>> => {
  return post(`/projects/${projectId}/videos`, videoData);
};
