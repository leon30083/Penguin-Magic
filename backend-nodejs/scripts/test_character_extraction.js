const axios = require('axios');

const API_BASE = 'http://localhost:8765/api/sora';
const TASK_ID = 'video_d92cb79c-c3fc-4508-a831-f11847e10dfa';

async function run() {
  try {
    // 1. Get video URL
    console.log(`Fetching task ${TASK_ID}...`);
    const taskRes = await axios.get(`${API_BASE}/tasks/${TASK_ID}`);
    
    if (!taskRes.data.success) {
      console.error('Task fetch failed:', taskRes.data);
      return;
    }

    const taskData = taskRes.data.data;
    const videoUrl = taskData.video_url || taskData.video?.url || taskData.url;

    if (!videoUrl) {
      console.error('No video URL found in task data:', taskData);
      return;
    }

    console.log('Video URL retrieved:', videoUrl);

    // 2. Create Character
    console.log('Creating character from video...');
    const payload = {
      url: videoUrl, // Changed from video_url to url based on API error
      timestamps: "00:01" 
    };

    const charRes = await axios.post(`${API_BASE}/characters`, payload);

    if (charRes.data.success) {
      console.log('Character created successfully!');
      console.log('Character Data:', JSON.stringify(charRes.data.data, null, 2));
    } else {
      console.error('Character creation failed:', charRes.data);
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

run();
