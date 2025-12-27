const axios = require('axios');
require('dotenv').config();

const KEY = process.env.JUXIN_API_KEY || 'sk-Q6DwAtsNvutSlaZXYAzXR39pUmwKHAHDgll0QifCL5GbwJd7';
const BASE = 'https://api.jxincm.cn';

const CHARACTER_USERNAME = "ed374f540.prestomagi"; // From our previous success

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    console.log(`Using Character: ${CHARACTER_USERNAME}`);
    
    // Prompt MUST contain @username
    const prompt = `@${CHARACTER_USERNAME} performing a magic trick with a glowing orb, cinematic lighting, 4k`;
    
    console.log(`Prompt: "${prompt}"`);

    // 1. Generate Video with Character
    console.log('\n--- 1. Generating Video with Character ---');
    let taskId = null;
    try {
        const payload = {
            model: "sora-2",
            prompt: prompt,
            size: "1280x720", 
            aspect_ratio: "16:9",
            duration: 5
        };
        
        console.log('Sending create request...');
        const res = await axios.post(`${BASE}/v1/video/create`, payload, {
            headers: { 
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Create response:', res.status, res.data);
        if (res.data && res.data.id) {
            taskId = res.data.id;
            console.log(`Task ID: ${taskId}`);
        } else {
            throw new Error('No Task ID returned');
        }

    } catch (e) {
        console.error('Generate Video Failed:', e.response ? e.response.data : e.message);
        return;
    }

    // 2. Poll Status
    console.log('\n--- 2. Polling Status ---');
    let videoUrl = null;
    let attempts = 0;
    const maxAttempts = 60; 

    while (attempts < maxAttempts) {
        try {
            const queryRes = await axios.get(`${BASE}/v1/video/query?id=${taskId}`, {
                headers: { 'Authorization': `Bearer ${KEY}` }
            });
            
            const data = queryRes.data;
            const status = data.task_status || data.status;
            console.log(`[Attempt ${attempts+1}] Status: ${status}`);
            
            if (status === 'succeeded' || status === 'SUCCESS' || status === 'completed') { 
                 videoUrl = data.video_url || data.video?.url || data.url || (data.data && data.data.url);
                 console.log('Video Generation SUCCESS!');
                 console.log('Video URL:', videoUrl);
                 break;
            } else if (status === 'failed' || status === 'FAIL') {
                console.error('Video Generation FAILED:', data);
                return;
            }

            await sleep(10000); // Wait 10s
            attempts++;
        } catch (e) {
            console.error('Polling Error:', e.message);
            await sleep(10000);
            attempts++;
        }
    }
}

run();
