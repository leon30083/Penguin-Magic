const axios = require('axios');
require('dotenv').config();

const KEY = process.env.JUXIN_API_KEY || 'sk-Q6DwAtsNvutSlaZXYAzXR39pUmwKHAHDgll0QifCL5GbwJd7';
const BASE = 'https://api.jxincm.cn';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    console.log(`Using API Key: ${KEY.substring(0, 5)}...`);

    // 1. Generate Video
    console.log('\n--- 1. Generating Video (Sora 2) ---');
    let taskId = null;
    try {
        const payload = {
            model: "sora-2",
            prompt: "A cute penguin wearing a magician hat, performing a magic trick with cards, 4k, high quality",
            size: "1080P",
            aspect_ratio: "16:9", // Based on doc, aspect_ratio or size might vary by model, checking doc again: sora-2 uses 'size'='small'(720p) or 'orientation' etc. Let's try standard payload from doc.
            // sora-2 doc says: model, orientation, prompt, size, duration, watermark, private
            orientation: "landscape",
            duration: 5,
            watermark: false,
            private: false,
            images: []
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
    const maxAttempts = 60; // 10 minutes (if 10s interval)

    while (attempts < maxAttempts) {
        try {
            const queryRes = await axios.get(`${BASE}/v1/video/query?id=${taskId}`, {
                headers: { 'Authorization': `Bearer ${KEY}` }
            });
            
            const data = queryRes.data;
            // Common status fields: task_status, status. 
            // Looking at similar apis: 'processing', 'succeeded', 'failed'
            const status = data.task_status || data.status;
            console.log(`[Attempt ${attempts+1}] Status: ${status}`);
            
            if (status === 'succeeded' || status === 'SUCCESS' || status === 'completed') { 
                 // Find URL. 
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

    if (!videoUrl) {
        console.error('Timeout or URL not found.');
        return;
    }

    // 3. Create Character
    console.log('\n--- 3. Creating Character ---');
    try {
        const charPayload = {
            url: videoUrl,
            timestamps: "1,3", // Using string as per error message seen earlier
            name: "Magic Penguin Character"
        };
        
        console.log('Sending character create request...');
        const charRes = await axios.post(`${BASE}/sora/v1/characters`, charPayload, {
             headers: {
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Character Creation Status:', charRes.status);
        console.log('Character Data:', JSON.stringify(charRes.data, null, 2));

    } catch (e) {
        console.error('Character Creation Failed:', e.response ? e.response.data : e.message);
    }
}

run();
