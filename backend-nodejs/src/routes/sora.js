const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const JsonStorage = require('../utils/jsonStorage');

// Ensure temp directory exists
const tempDir = path.join(config.BASE_DIR, 'temp_uploads');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const upload = multer({ dest: tempDir });

// Helper for Juxin API calls
const juxinApi = axios.create({
  baseURL: 'https://api.jxincm.cn',
  timeout: 60000 // 60s timeout
});

// Middleware to inject Authorization header
juxinApi.interceptors.request.use((reqConfig) => {
    if (config.JUXIN_API_KEY) {
        reqConfig.headers['Authorization'] = `Bearer ${config.JUXIN_API_KEY}`;
    }
    return reqConfig;
}, (error) => {
    return Promise.reject(error);
});

// 1. Upload Proxy
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));

    const response = await juxinApi.post('/api/upload', form, {
        headers: {
          ...form.getHeaders()
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });

    // Cleanup temp file
    try {
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    } catch (e) {
        console.error('Error deleting temp file:', e);
    }

    res.json({ success: true, data: response.data });
  } catch (error) {
    // Cleanup temp file
    try {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    } catch (e) {
        console.error('Error deleting temp file:', e);
    }

    console.error('Upload error:', error.response ? error.response.data : error.message);
    const errorMsg = error.response 
        ? `Server Error (${error.response.status}): ${typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)}` 
        : error.message;
        
    res.status(error.response ? error.response.status : 500).json({ 
        success: false,
        error: errorMsg,
        details: error.response ? error.response.data : error.message 
    });
  }
});

// 2. Create Character Proxy (Just proxies the creation task)
router.post('/characters', async (req, res) => {
  try {
    console.log('Creating character with payload:', req.body);
    const response = await juxinApi.post('/sora/v1/characters', req.body);
    
    // Note: Sora 2 character creation is async and returns a task ID usually,
    // or if it returns immediate data, we should let the frontend decide when to save.
    // We do NOT save to characters.json here anymore to support async polling flow.

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Create Character error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
        success: false,
        error: 'Create Character failed', 
        details: error.response ? error.response.data : error.message 
    });
  }
});

// 2.5 Save Character (Manually called by frontend after polling success)
router.post('/characters/save', (req, res) => {
    try {
        const newCharacter = req.body;
        if (!newCharacter || !newCharacter.id || !newCharacter.username) {
            return res.status(400).json({ success: false, error: 'Invalid character data' });
        }

        const characters = JsonStorage.load(config.CHARACTERS_FILE, []);
        
        const existsIndex = characters.findIndex(c => c.id === newCharacter.id);
        if (existsIndex >= 0) {
            characters[existsIndex] = newCharacter; // Update existing
        } else {
            characters.push(newCharacter);
        }
        
        JsonStorage.save(config.CHARACTERS_FILE, characters);
        
        res.json({ success: true, data: newCharacter });
    } catch (error) {
        console.error('Save Character error:', error);
        res.status(500).json({ success: false, error: 'Failed to save character' });
    }
});

// 3. Get Characters
router.get('/characters', (req, res) => {
    try {
        const characters = JsonStorage.load(config.CHARACTERS_FILE, []);
        res.json({
            success: true,
            data: characters
        });
    } catch (error) {
        console.error('Get Characters error:', error);
        res.status(500).json({ success: false, error: 'Failed to retrieve characters' });
    }
});

// 4. Create Video Proxy
router.post('/video/create', async (req, res) => {
  try {
    console.log('Creating video with payload:', req.body);
    const response = await juxinApi.post('/v1/video/create', req.body);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Create Video error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
        success: false,
        error: 'Create Video failed', 
        details: error.response ? error.response.data : error.message 
    });
  }
});

// 5. Query Task Proxy
router.get('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const response = await juxinApi.get(`/v1/video/query?id=${taskId}`);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Query Task error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
        success: false,
        error: 'Query Task failed', 
        details: error.response ? error.response.data : error.message 
    });
  }
});

module.exports = router;
