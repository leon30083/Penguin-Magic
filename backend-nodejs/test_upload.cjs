const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const KEY = process.env.JUXIN_API_KEY || 'sk-Q6DwAtsNvutSlaZXYAzXR39pUmwKHAHDgll0QifCL5GbwJd7';
const BASE = 'https://api.jxincm.cn';

const VIDEO_PATH = 'e:\\User\\GitHub\\Penguin-Magic\\用户输入文件夹\\Qwen Chat.mp4';
const FALLBACK_URL = "https://filesystem.site/cdn/20251030/javYrU4etHVFDqg8by7mViTWHlMOZy.mp4";

async function run() {
    console.log(`Using API Key: ${KEY.substring(0, 5)}...`);

    // -1. Check API Connectivity (List Models)
    try {
        console.log('Checking API Connectivity (GET /v1/models)...');
        const modelsRes = await axios.get(`${BASE}/v1/models`, {
            headers: { 'Authorization': `Bearer ${KEY}` },
            validateStatus: () => true
        });
        console.log('Models status:', modelsRes.status);
        if (modelsRes.status === 200) {
            console.log('API Key seems VALID. Connected to Juxin API.');
        } else {
            console.log('API Key check FAILED or Endpoint invalid.');
            console.log('Response:', JSON.stringify(modelsRes.data).substring(0, 200));
        }
    } catch (e) {
        console.error('Connectivity check error:', e.message);
    }

    // 0. Test with tiny buffer first
    
    let videoUrl = null;

    // 1. Try Upload (Buffer Test)
    console.log(`\n--- Attempting Upload of Dummy Image ---`);
    try {
        const form = new FormData();
        // Create a 1x1 transparent pixel PNG buffer
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
        form.append('file', buffer, { filename: 'test_pixel.png', contentType: 'image/png' });
        
        console.log('Sending upload request...');
        const uploadRes = await axios.post(`${BASE}/api/upload`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${KEY}`
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            validateStatus: status => true
        });

        console.log('Upload status:', uploadRes.status);
        if (uploadRes.status === 200) {
             console.log('Upload SUCCESS. URL:', uploadRes.data.data);
        } else {
            console.log('Upload FAILED. Data:', JSON.stringify(uploadRes.data).substring(0, 200));
        }
    } catch (e) {
        console.error('Upload EXCEPTION:', e.message);
    }

    // 2. Create Character (using uploaded URL or Fallback)
    const targetUrl = videoUrl || FALLBACK_URL;
    console.log(`\n--- Attempting Character Creation ---`);
    console.log(`Using URL: ${targetUrl}`);
    
    if (targetUrl === FALLBACK_URL) {
        console.log("(Using fallback URL because upload failed or file missing)");
    }

    try {
        const charPayload = {
            url: targetUrl,
            timestamps: "1,3", 
            name: "Test Character"
        };
        
        const charRes = await axios.post(`${BASE}/sora/v1/characters`, charPayload, {
             headers: {
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            },
            validateStatus: status => true
        });

        console.log('Character creation status:', charRes.status);
        console.log('Character creation data:', JSON.stringify(charRes.data, null, 2));

    } catch (e) {
        console.error('Character creation EXCEPTION:', e.message);
    }
}

run();
