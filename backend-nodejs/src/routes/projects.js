const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const JsonStorage = require('../utils/jsonStorage');

// Helper to get projects
const getProjects = () => JsonStorage.load(config.PROJECTS_FILE, []);
const saveProjects = (data) => JsonStorage.save(config.PROJECTS_FILE, data);

// Helper to get videos
const getVideos = () => JsonStorage.load(config.VIDEOS_FILE, []);
const saveVideos = (data) => JsonStorage.save(config.VIDEOS_FILE, data);

// 1. Get all projects
router.get('/', (req, res) => {
  try {
    const projects = getProjects();
    // Sort by updated time desc
    projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Create a project
router.post('/', (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Project name is required' });
    }

    const projects = getProjects();
    const newProject = {
      id: uuidv4(),
      name,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      videoCount: 0
    };

    projects.push(newProject);
    saveProjects(projects);

    res.json({ success: true, data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Get project details (including videos)
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const projects = getProjects();
    const project = projects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const videos = getVideos();
    const projectVideos = videos.filter(v => v.projectId === id);
    // Sort videos by created time desc
    projectVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: { ...project, videos: projectVideos } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Delete project
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    let projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Remove project
    projects.splice(projectIndex, 1);
    saveProjects(projects);

    // Optionally: remove associated videos or keep them?
    // For now, let's keep them but maybe mark them as orphaned or just filter them out in UI
    // Or we can delete them:
    /*
    let videos = getVideos();
    videos = videos.filter(v => v.projectId !== id);
    saveVideos(videos);
    */

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Add video to project (Manual or callback)
router.post('/:id/videos', (req, res) => {
  try {
    const { id } = req.params;
    const { url, prompt, taskId, metadata } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'Video URL is required' });
    }

    const projects = getProjects();
    const project = projects.find(p => p.id === id);
    if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const videos = getVideos();
    const newVideo = {
      id: taskId || uuidv4(), // Use taskId if available as ID, or generate one
      projectId: id,
      url,
      prompt: prompt || '',
      metadata: metadata || {},
      createdAt: new Date().toISOString()
    };

    videos.push(newVideo);
    saveVideos(videos);

    // Update project video count and timestamp
    project.videoCount = (project.videoCount || 0) + 1;
    project.updatedAt = new Date().toISOString();
    saveProjects(projects);

    res.json({ success: true, data: newVideo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
