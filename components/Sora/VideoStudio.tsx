import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getCharacters, createVideo, getTask } from '../../services/api/sora';
import { RefreshIcon } from '../icons/RefreshIcon';
import { BoltIcon } from '../icons/BoltIcon';

interface Character {
  id: string;
  username: string;
  permalink: string;
  profile_picture_url: string;
}

interface VideoStudioProps {
  onSwitchTab?: (tab: 'character' | 'video') => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({ onSwitchTab }) => {
  const { theme } = useTheme();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [prompt, setPrompt] = useState('');
  
  // Params
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [duration, setDuration] = useState(10);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadCharacters();
  }, []);

  // Poll for task status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    // Continue polling as long as it's not a terminal state
    const isTerminalState = (s: string) => 
      ['succeeded', 'completed', 'SUCCESS', 'failed', 'FAIL'].includes(s);

    if (taskId && !isTerminalState(taskStatus)) {
      interval = setInterval(async () => {
        const res = await getTask(taskId);
        if (res.success && res.data) {
          const status = res.data.task_status || res.data.status;
          setTaskStatus(status);
          
          // Update progress if available
          if (res.data.percentage) setProgress(res.data.percentage);
          else if (res.data.progress) setProgress(res.data.progress);

          const url = res.data.video_url || res.data.video?.url || res.data.url;
          
          if (['succeeded', 'completed', 'SUCCESS'].includes(status)) {
            if (url) {
                setVideoUrl(url);
                setTaskId(''); // Stop polling
                setProgress(100);
            }
          } else if (['failed', 'FAIL'].includes(status)) {
             let errorDetail = 'Unknown error';
             if (res.data.error) {
                 if (typeof res.data.error === 'string') errorDetail = res.data.error;
                 else if (res.data.error.message) errorDetail = res.data.error.message;
                 else errorDetail = JSON.stringify(res.data.error);
             }
             setErrorMsg('Generation failed: ' + errorDetail);
             setTaskId('');
          }
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [taskId, taskStatus]);

  const loadCharacters = async () => {
    const res = await getCharacters();
    if (res.success && res.data) {
      setCharacters(res.data);
    }
  };

  const handleAddCharacter = () => {
    if (selectedChar) {
      setPrompt(prev => `${prev} @${selectedChar.username} `);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setErrorMsg('');
    setVideoUrl('');
    setTaskStatus('');
    
    const payload = {
      model: 'sora-2',
      prompt: prompt,
      orientation: aspectRatio === '9:16' ? 'portrait' : 'landscape',
      duration: Number(duration),
      size: 'small',
      images: [],
      watermark: false
    };

    const res = await createVideo(payload);
    setIsGenerating(false);

    if (res.success && res.data) {
      if (res.data.id) {
        setTaskId(res.data.id);
        setTaskStatus('pending');
      } else {
        setErrorMsg('No task ID returned');
      }
    } else {
      setErrorMsg(res.error || 'Generation failed');
    }
  };

  return (
    <div className="flex gap-6 h-full">
        {/* Left: Controls */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {/* Character Selector */}
            <div className="p-4 rounded-xl border" style={{ borderColor: theme.border, backgroundColor: theme.bgPrimary }}>
                <h3 className="font-bold mb-3" style={{ color: theme.textPrimary }}>1. Select Character (Optional)</h3>
                <div className="flex flex-wrap gap-2">
                    {characters.map(char => (
                        <button
                            key={char.id}
                            onClick={() => setSelectedChar(char)}
                            className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                                selectedChar?.id === char.id ? 'bg-blue-600 border-blue-600 text-white' : 'hover:bg-gray-700'
                            }`}
                            style={{ borderColor: selectedChar?.id === char.id ? 'transparent' : theme.border, color: theme.textPrimary }}
                        >
                            <img src={char.profile_picture_url} className="w-6 h-6 rounded-full" alt={char.username} />
                            <span className="text-sm">{char.username}</span>
                        </button>
                    ))}
                    {characters.length === 0 && (
                        <div className="flex items-center gap-2 text-sm opacity-50" style={{ color: theme.textSecondary }}>
                            <span>No characters found.</span>
                            {onSwitchTab && (
                                <button 
                                    onClick={() => onSwitchTab('character')}
                                    className="text-blue-500 hover:underline"
                                >
                                    Create one in Character Lab
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Prompt */}
            <div className="p-4 rounded-xl border flex flex-col gap-3" style={{ borderColor: theme.border, backgroundColor: theme.bgPrimary }}>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold" style={{ color: theme.textPrimary }}>2. Prompt</h3>
                    <button 
                        onClick={handleAddCharacter}
                        disabled={!selectedChar}
                        className={`text-xs px-2 py-1 rounded ${selectedChar ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                    >
                        + Insert Selected Character
                    </button>
                </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your video... Use @username to refer to characters."
                    className="w-full h-32 p-3 rounded bg-transparent border focus:ring-1 outline-none resize-none"
                    style={{ borderColor: theme.border, color: theme.textPrimary }}
                />
            </div>

            {/* Settings */}
            <div className="p-4 rounded-xl border grid grid-cols-2 gap-4" style={{ borderColor: theme.border, backgroundColor: theme.bgPrimary }}>
                <div>
                    <label className="text-sm block mb-1 opacity-70" style={{ color: theme.textSecondary }}>Aspect Ratio</label>
                    <select 
                        value={aspectRatio} 
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full p-2 rounded border bg-transparent"
                        style={{ borderColor: theme.border, color: theme.textPrimary }}
                    >
                        <option value="9:16" className="text-black">Portrait (9:16)</option>
                        <option value="16:9" className="text-black">Landscape (16:9)</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm block mb-1 opacity-70" style={{ color: theme.textSecondary }}>Duration (s)</label>
                    <select 
                        value={duration} 
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full p-2 rounded border bg-transparent"
                        style={{ borderColor: theme.border, color: theme.textPrimary }}
                    >
                        <option value={10} className="text-black">10s</option>
                        <option value={15} className="text-black">15s</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className={`py-3 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${
                    isGenerating || !prompt ? 'bg-gray-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
                }`}
            >
                <BoltIcon />
                {isGenerating ? 'Submitting...' : 'Generate Video'}
            </button>
            {errorMsg && <div className="text-red-500 text-sm text-center">{errorMsg}</div>}
        </div>

        {/* Right: Preview */}
        <div className="w-1/3 p-4 rounded-xl border flex flex-col items-center justify-center bg-black/20" style={{ borderColor: theme.border }}>
            {videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="w-full max-h-full rounded-lg" />
            ) : (
                <div className="text-center opacity-50 flex flex-col items-center gap-2" style={{ color: theme.textSecondary }}>
                    {taskId ? (
                        <>
                            <RefreshIcon className="animate-spin" size={32} color={theme.textPrimary} />
                            <div>Generating... {progress > 0 && `${progress}%`}</div>
                            <div className="w-full max-w-[200px] h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="text-xs font-mono opacity-50">{taskId}</div>
                            <div className="text-xs opacity-70">Status: {taskStatus}</div>
                        </>
                    ) : (
                        <div>Video preview will appear here</div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};
