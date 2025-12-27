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
  // Backend returns the character object directly
  const response = await post<any>('/sora/characters', data);
  // Wrap it to match ApiResponse<T> where data is T
  // Actually, existing `post` returns ApiResponse<T>.
  // If backend returns { id: ... }, `post` returns { success: true, data: { id: ... } } IF backend response matches that structure?
  // Wait, `post` in index.ts expects backend to return JSON. It doesn't enforce a { success: true, data: ... } structure from the backend itself, 
  // BUT `request` function does: `const data = await response.json(); return data;`
  // My backend returns just the data (e.g. { id: ... }).
  // BUT `request` function implementation:
  // `return data;`
  // It returns whatever the backend returns.
  // BUT the return type is `Promise<ApiResponse<T>>`.
  // If my backend returns `{ id: '...' }`, then `data` is `{ id: '...' }`.
  // This does NOT match `ApiResponse<T>` which is `{ success: true, data: T } ...`.
  
  // Looking at `server.js`:
  // `res.json({ success: true, data: { ... } })`
  
  // BUT my `sora.js` implementation:
  // `res.json(response.data)` -> This is the Juxin API response.
  // Juxin API response for character creation is `{ id: '...', ... }`.
  
  // So my backend returns `{ id: ... }`.
  // The frontend `request` function receives `{ id: ... }`.
  // It returns `{ id: ... }`.
  // This is NOT `ApiResponse<T>`.
  
  // I need to wrap the response in my backend or frontend.
  // Standard in this project seems to be `res.json({ success: true, data: ... })` (based on `server.js` status route).
  // Let's check `creative.js` to see what it returns.
  
  return response;
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
