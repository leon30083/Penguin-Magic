const axios = require('axios');
require('dotenv').config();

const KEY = process.env.JUXIN_API_KEY || 'sk-Q6DwAtsNvutSlaZXYAzXR39pUmwKHAHDgll0QifCL5GbwJd7';
const BASE = 'https://api.jxincm.cn';
const TASK_ID = 'video_a367a9db-db30-4140-b9e5-e5000e66bf9f';

async function run() {
    console.log(`Checking Task ID: ${TASK_ID}`);
    try {
        const queryRes = await axios.get(`${BASE}/v1/video/query?id=${TASK_ID}`, {
            headers: { 'Authorization': `Bearer ${KEY}` }
        });
        
        console.log('Query Response Data:', JSON.stringify(queryRes.data, null, 2));
        
        const data = queryRes.data;
        // Try to find URL
        const videoUrl = data.video_url || data.video?.url || data.url || (data.data && data.data.url) || (data.result && data.result.url);
        
        if (videoUrl) {
            console.log(`\nFound Video URL: ${videoUrl}`);
            
            // Proceed to Create Character
            console.log('\n--- Creating Character (Attempt 1: from_task) ---');
            // Doc says: url and from_task are mutually exclusive (one or the other).
            // Let's try from_task since we have it and it avoids URL access issues.
            // Also removing 'name' as it's not in the OpenAPI spec requestBody properties.
            const charPayload = {
                from_task: TASK_ID,
                timestamps: "1,3"
            };
            
            console.log('Payload:', JSON.stringify(charPayload));
            
            try {
                const charRes = await axios.post(`${BASE}/sora/v1/characters`, charPayload, {
                    headers: {
                        'Authorization': `Bearer ${KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Character Creation Status:', charRes.status);
                console.log('Character Data:', JSON.stringify(charRes.data, null, 2));
            } catch (e) {
                console.error('Attempt 1 Failed:', e.response ? e.response.data : e.message);
                
                // Attempt 2: Try with model parameter if possible (wild guess)
                console.log('\n--- Creating Character (Attempt 2: with model param) ---');
                try {
                     const payload2 = {
                        ...charPayload,
                        model: "sora-2" // Guessing
                     };
                     const res2 = await axios.post(`${BASE}/sora/v1/characters`, payload2, {
                        headers: { 'Authorization': `Bearer ${KEY}` }
                     });
                     console.log('Attempt 2 Success:', res2.data);
                } catch (e2) {
                     console.error('Attempt 2 Failed:', e2.response ? e2.response.data : e2.message);
                }
            }
            
        } else {
            console.error('Could not find URL in response.');
        }

    } catch (e) {
        console.error('Error:', e.response ? e.response.data : e.message);
    }
}

run();
