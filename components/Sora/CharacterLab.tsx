import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { uploadFile, createCharacter, getCharacters, createVideo, getTask, saveCharacter } from '../../services/api/sora';
import { RefreshIcon } from '../icons/RefreshIcon';

// Types
interface Character {
  id: string;
  username: string;
  permalink: string;
  profile_picture_url: string;
}

interface CharacterLabProps {
  onSwitchTab?: (tab: 'character' | 'video') => void;
}

export const CharacterLab: React.FC<CharacterLabProps> = ({ onSwitchTab }) => {
  const { theme } = useTheme();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'generate' | 'upload'>('generate');

  // Common State
  const [timestamps, setTimestamps] = useState<string>('1,3');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loadingChars, setLoadingChars] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isCreatingChar, setIsCreatingChar] = useState(false);

  // Generate Mode State
  const [genPrompt, setGenPrompt] = useState('');
  const [genTaskId, setGenTaskId] = useState('');
  const [genVideoUrl, setGenVideoUrl] = useState('');
  const [genStatus, setGenStatus] = useState<'idle' | 'creating' | 'polling' | 'completed' | 'failed'>('idle');

  // Character Creation State
  const [charCreationTaskId, setCharCreationTaskId] = useState('');
  const [charCreationProgress, setCharCreationProgress] = useState(0);

  // Upload Mode State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchCharacters = async () => {
    setLoadingChars(true);
    const res = await getCharacters();
    if (res.success && res.data) {
      setCharacters(res.data);
    }
    setLoadingChars(false);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  // --- Generate Video Logic ---
  const handleGenerateVideo = async () => {
    if (!genPrompt) return;
    
    setGenStatus('creating');
    setStatusMsg('Submitting video generation task...');
    setGenVideoUrl('');
    setGenTaskId('');

    const res = await createVideo({
      model: 'sora-2',
      prompt: genPrompt,
      size: '1280x720', // Must use this size
      aspect_ratio: '16:9',
      duration: 5
    });

    if (res.success && res.data && res.data.id) {
        const taskId = res.data.id;
        setGenTaskId(taskId);
        setStatusMsg(`Task submitted (ID: ${taskId}). Polling status...`);
        setGenStatus('polling');
        pollTaskStatus(taskId);
    } else {
        setGenStatus('failed');
        setStatusMsg('Failed to create video task: ' + (res.error || 'Unknown error'));
    }
  };

  const pollTaskStatus = async (taskId: string) => {
      const maxAttempts = 60;
      let attempts = 0;

      const interval = setInterval(async () => {
          attempts++;
          if (attempts > maxAttempts) {
              clearInterval(interval);
              setGenStatus('failed');
              setStatusMsg('Video generation timed out.');
              return;
          }

          const res = await getTask(taskId);
          if (res.success && res.data) {
              const status = res.data.task_status || res.data.status;
              const url = res.data.video_url || res.data.video?.url || res.data.url;
              
              if (status === 'succeeded' || status === 'completed' || status === 'SUCCESS') {
                  clearInterval(interval);
                  setGenVideoUrl(url);
                  setGenStatus('completed');
                  setStatusMsg('Video generated successfully! Now you can extract a character.');
              } else if (status === 'failed' || status === 'FAIL') {
                  clearInterval(interval);
                  setGenStatus('failed');
                  setStatusMsg('Video generation failed: ' + (res.data.error || 'Unknown error'));
              } else {
                  setStatusMsg(`Generating video... Status: ${status} (${attempts}/${maxAttempts})`);
              }
          }
      }, 5000); // Poll every 5s
  };

  const pollCharacterCreation = async (taskId: string) => {
      const maxAttempts = 120; // Allow 10 minutes
      let attempts = 0;
      setCharCreationProgress(0);

      const interval = setInterval(async () => {
          attempts++;
          if (attempts > maxAttempts) {
              clearInterval(interval);
              setIsCreatingChar(false);
              setStatusMsg('Character creation timed out.');
              setCharCreationTaskId('');
              return;
          }

          const res = await getTask(taskId);
          if (res.success && res.data) {
              const status = res.data.task_status || res.data.status;
              
              // Update progress
              if (res.data.percentage) setCharCreationProgress(res.data.percentage);
              
              if (status === 'succeeded' || status === 'completed' || status === 'SUCCESS') {
                  clearInterval(interval);
                  setStatusMsg('Character created! Saving...');
                  setCharCreationProgress(100);
                  
                  // In Sora 2 API, when task succeeds, the character info might be in the result
                  const charData = res.data; 
                  
                  // Ensure we have minimal fields
                  if (charData && (charData.id || charData.task_id)) {
                      // If ID is task ID, we might need to map it or use it as ID
                      // Ideally the API returns the final character object in 'data' or similar
                      
                      const characterToSave = {
                          ...charData,
                          id: charData.id || charData.task_id,
                          username: charData.username || `user_${Date.now()}`,
                          // Ensure we have a profile picture if possible, or fallback
                          profile_picture_url: charData.profile_picture_url || charData.cover_url || charData.url || ''
                      };

                      const saveRes = await saveCharacter(characterToSave);
                      if (saveRes.success) {
                          setStatusMsg('Character saved successfully!');
                          fetchCharacters();
                      } else {
                          setStatusMsg('Character created but failed to save: ' + (saveRes.error || saveRes.message));
                      }
                  } else {
                      setStatusMsg('Task succeeded but no character data found.');
                  }
                  
                  setIsCreatingChar(false);
                  setCharCreationTaskId('');
                  
              } else if (status === 'failed' || status === 'FAIL') {
                  clearInterval(interval);
                  setIsCreatingChar(false);
                  setCharCreationTaskId('');
                  setStatusMsg('Character creation failed: ' + (res.data.error || 'Unknown error'));
              } else {
                  setStatusMsg(`Creating character... ${status} ${res.data.percentage ? `(${res.data.percentage}%)` : ''}`);
              }
          }
      }, 5000);
  };

  const handleCreateFromTask = async () => {
      if (!genTaskId || !timestamps) return;
      
      setIsCreatingChar(true);
      setStatusMsg('Submitting character creation task...');
      setCharCreationTaskId('');
      
      const res = await createCharacter({
          from_task: genTaskId,
          timestamps: timestamps
      });
      
      if (res.success && res.data && res.data.id) {
          const taskId = res.data.id;
          setCharCreationTaskId(taskId);
          setStatusMsg(`Character task submitted (ID: ${taskId}). Polling...`);
          pollCharacterCreation(taskId);
      } else {
          setIsCreatingChar(false);
          setStatusMsg('Character creation failed to start: ' + (res.error || res.message));
      }
  };

  // --- Upload Logic ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      
      setIsUploading(true);
      setStatusMsg('Uploading video to native storage...');
      const res = await uploadFile(file);
      setIsUploading(false);
      
      if (res.success && res.data) {
        // Try to find the URL in common fields
        const url = res.data.url || res.data.data?.url || (typeof res.data === 'string' ? res.data : '');
        
        if (url) {
            setUploadUrl(url);
            setStatusMsg('Upload complete!');
        } else {
            setStatusMsg('Upload succeeded but could not find URL in response.');
        }
      } else {
        setStatusMsg('Upload failed: ' + (res.error || res.message));
      }
    }
  };

  const handleCreateFromUrl = async () => {
    if (!uploadUrl || !timestamps) return;
    
    setIsCreatingChar(true);
    setStatusMsg('Submitting character creation task...');
    setCharCreationTaskId('');
    
    const res = await createCharacter({
      url: uploadUrl,
      timestamps: timestamps
    });
    
    if (res.success && res.data && res.data.id) {
        const taskId = res.data.id;
        setCharCreationTaskId(taskId);
        setStatusMsg(`Character task submitted (ID: ${taskId}). Polling...`);
        pollCharacterCreation(taskId);
    } else {
        setIsCreatingChar(false);
        setStatusMsg('Character creation failed to start: ' + (res.error || res.message));
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Left: Create Form */}
        <div className="flex flex-col gap-4 p-4 rounded-xl border overflow-y-auto" style={{ borderColor: theme.border, backgroundColor: theme.bgPrimary }}>
          <h3 className="text-lg font-bold" style={{ color: theme.textPrimary }}>New Character</h3>
          
          {/* Tabs */}
          <div className="flex gap-2 border-b pb-2" style={{ borderColor: theme.border }}>
              <button 
                onClick={() => setActiveTab('generate')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${activeTab === 'generate' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-400'}`}
              >
                1. Generate Base Video (Recommended)
              </button>
              <button 
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${activeTab === 'upload' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-400'}`}
              >
                2. Upload Video
              </button>
          </div>

          {activeTab === 'generate' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium" style={{ color: theme.textSecondary }}>Video Prompt</label>
                    <textarea 
                        value={genPrompt}
                        onChange={(e) => setGenPrompt(e.target.value)}
                        placeholder="Describe the character clearly (e.g. A cute penguin magician performing a trick, cinematic lighting, 4k)"
                        className="p-2 rounded border bg-transparent h-24 text-sm"
                        style={{ borderColor: theme.border, color: theme.textPrimary }}
                    />
                </div>
                
                <button
                    onClick={handleGenerateVideo}
                    disabled={!genPrompt || genStatus === 'creating' || genStatus === 'polling'}
                    className={`py-2 px-4 rounded-lg font-bold text-white transition-all ${
                        !genPrompt || genStatus === 'creating' || genStatus === 'polling' ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                >
                    {genStatus === 'creating' || genStatus === 'polling' ? 'Generating...' : 'Generate Video'}
                </button>

                {genVideoUrl && (
                    <div className="rounded overflow-hidden border" style={{ borderColor: theme.border }}>
                        <video src={genVideoUrl} controls className="w-full h-auto" />
                    </div>
                )}
                
                {genStatus === 'completed' && (
                    <div className="p-3 rounded bg-green-900/20 border border-green-500/30 text-xs text-green-400">
                        Video ready! Now you can extract the character.
                    </div>
                )}

                <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: theme.border }}>
                    <label className="text-sm font-medium" style={{ color: theme.textSecondary }}>Timestamps (e.g., "1,3")</label>
                    <input 
                        type="text" 
                        value={timestamps}
                        onChange={(e) => setTimestamps(e.target.value)}
                        placeholder="Start,End (seconds)"
                        className="p-2 rounded border bg-transparent"
                        style={{ borderColor: theme.border, color: theme.textPrimary }}
                    />
                </div>

                <button
                    onClick={handleCreateFromTask}
                    disabled={!genTaskId || !timestamps || isCreatingChar || genStatus !== 'completed'}
                    className={`py-2 px-4 rounded-lg font-bold text-white transition-all ${
                        !genTaskId || !timestamps || isCreatingChar || genStatus !== 'completed' ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
                    }`}
                >
                    {isCreatingChar ? 'Creating Character...' : 'Create Character from Video'}
                </button>
            </div>
          )}

          {activeTab === 'upload' && (
             <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="p-3 rounded bg-yellow-900/20 border border-yellow-500/30 text-xs text-yellow-400">
                    Warning: Uploading files may fail with "channel not found" due to API limits. Using the "Generate Base Video" tab is recommended.
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium" style={{ color: theme.textSecondary }}>Upload Video Source</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="file" 
                            accept="video/*" 
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                    </div>
                    {isUploading && <span className="text-xs text-blue-400">Uploading...</span>}
                    {uploadUrl && <span className="text-xs text-green-400 break-all">URL: {uploadUrl}</span>}
                    
                    {/* Fallback URL Input */}
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                        <p className="text-xs mb-1 opacity-70" style={{ color: theme.textSecondary }}>Or enter video URL directly:</p>
                        <input
                            type="text"
                            placeholder="https://example.com/video.mp4"
                            value={uploadUrl}
                            onChange={(e) => setUploadUrl(e.target.value)}
                            className="w-full bg-transparent border rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                            style={{ borderColor: theme.border, color: theme.textPrimary }}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium" style={{ color: theme.textSecondary }}>Timestamps (e.g., "1,3")</label>
                    <input 
                    type="text" 
                    value={timestamps}
                    onChange={(e) => setTimestamps(e.target.value)}
                    placeholder="Start,End (seconds)"
                    className="p-2 rounded border bg-transparent"
                    style={{ borderColor: theme.border, color: theme.textPrimary }}
                    />
                </div>

                <button
                    onClick={handleCreateFromUrl}
                    disabled={!uploadUrl || !timestamps || isCreatingChar}
                    className={`mt-4 py-2 px-4 rounded-lg font-bold text-white transition-all ${
                    !uploadUrl || !timestamps || isCreatingChar ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                >
                    {isCreatingChar ? 'Creating...' : 'Create Character'}
                </button>
            </div>
          )}
          
          {statusMsg && <div className="text-sm mt-2 font-mono break-all p-2 rounded bg-black/20" style={{ color: theme.textPrimary }}>{statusMsg}</div>}
          
          {/* Character Creation Progress Bar */}
          {isCreatingChar && (
            <div className="w-full mt-2">
                <div className="flex justify-between text-xs mb-1" style={{ color: theme.textSecondary }}>
                    <span>Creating Character...</span>
                    <span>{charCreationProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${charCreationProgress}%` }}
                    />
                </div>
            </div>
          )}

          {statusMsg.includes('successfully') && onSwitchTab && (
            <button
                onClick={() => onSwitchTab('video')}
                className="mt-2 w-full py-2 px-4 rounded-lg font-bold text-white bg-green-600 hover:bg-green-500 transition-all"
            >
                Go to Video Studio &rarr;
            </button>
          )}
        </div>

        {/* Right: Character List */}
        <div className="flex flex-col gap-4 p-4 rounded-xl border h-full overflow-hidden" style={{ borderColor: theme.border, backgroundColor: theme.bgPrimary }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold" style={{ color: theme.textPrimary }}>My Characters</h3>
            <button onClick={fetchCharacters} className="p-1 hover:bg-gray-700 rounded"><RefreshIcon size={16} color={theme.textPrimary}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
            {characters.map(char => (
              <div key={char.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: theme.border }}>
                <img src={char.profile_picture_url} alt={char.username} className="w-12 h-12 rounded-full object-cover bg-gray-700" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate" style={{ color: theme.textPrimary }}>{char.username}</div>
                  <div className="text-xs opacity-60 truncate" style={{ color: theme.textSecondary }}>ID: {char.id}</div>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(`@${char.username}`)}
                  className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  Copy ID
                </button>
              </div>
            ))}
            {characters.length === 0 && !loadingChars && (
              <div className="text-center opacity-50 py-10" style={{ color: theme.textSecondary }}>No characters yet</div>
            )}
            {loadingChars && (
                <div className="text-center py-10" style={{ color: theme.textSecondary }}>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
