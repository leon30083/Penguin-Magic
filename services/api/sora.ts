import { ApiResponse, get, post } from './index';

const API_BASE = '/api';

// Native Upload
export const uploadFile = async (file: File): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/sora/upload`, {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header, browser will set it to multipart/form-data with boundary
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          message: errorData.message,
        };
      } catch {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    }

    // Backend returns { success: true, data: ... }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network request failed',
    };
  }
};

// Create Character
export const createCharacter = async (data: { url?: string; from_task?: string; timestamps: string }): Promise<ApiResponse<any>> => {
  return post<any>('/sora/characters', data);
};

// Save Character (Manual save after polling)
export const saveCharacter = async (characterData: any): Promise<ApiResponse<any>> => {
  return post<any>('/sora/characters/save', characterData);
};

// Get Characters
export const getCharacters = async (): Promise<ApiResponse<any[]>> => {
  return get<any[]>('/sora/characters');
};

// Create Video
export const createVideo = async (data: any): Promise<ApiResponse<any>> => {
  return post<any>('/sora/video/create', data);
};

// Get Task Status
export const getTask = async (taskId: string): Promise<ApiResponse<any>> => {
  return get<any>(`/sora/tasks/${taskId}`);
};
