const express = require('express');
const path = require('path');
const crypto = require('crypto');
const config = require('../config');
const JsonStorage = require('../utils/jsonStorage');
const FileHandler = require('../utils/fileHandler');

const router = express.Router();

/**
 * 处理创意图片：将base64保存为文件
 */
function processCreativeImage(idea) {
  const imageUrl = idea.imageUrl || '';
  
  // 如果已经是本地文件URL，直接返回
  if (!imageUrl || imageUrl.startsWith('/files/')) {
    return idea;
  }
  
  // 如果是base64，保存到文件
  if (imageUrl.startsWith('data:')) {
    const result = FileHandler.saveImage(imageUrl, config.CREATIVE_IMAGES_DIR);
    if (result.success) {
      idea.imageUrl = result.data.url;
      console.log(`  ✓ 创意图片已保存: ${result.data.filename}`);
    } else {
      console.error(`  ✗ 创意图片保存失败: ${result.error}`);
    }
  }
  
  return idea;
}

// 获取所有创意
router.get('/', (req, res) => {
  const ideas = JsonStorage.load(config.CREATIVE_IDEAS_FILE, []);
  res.json({ success: true, data: ideas });
});

// 获取单个创意
router.get('/:id', (req, res) => {
  const ideaId = parseInt(req.params.id);
  const ideas = JsonStorage.load(config.CREATIVE_IDEAS_FILE, []);
  const idea = ideas.find(i => i.id === ideaId);
  
  if (idea) {
    res.json({ success: true, data: idea });
  } else {
    res.status(404).json({ success: false, error: '创意不存在' });
  }
});

// 创建新创意
router.post('/', (req, res) => {
  const ideas = JsonStorage.load(config.CREATIVE_IDEAS_FILE, []);
  
  // 生成新ID
  const newId = Math.max(...ideas.map(i => i.id || 0), 0) + 1;
  const newIdea = {
    ...req.body,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 处理图片：将base64保存为文件
  processCreativeImage(newIdea);
  
  ideas.push(newIdea);
  JsonStorage.save(config.CREATIVE_IDEAS_FILE, ideas);
  
  res.json({ success: true, data: newIdea });
});

// 更新创意
router.put('/:id', (req, res) => {
  const ideaId = parseInt(req.params.id);
  const ideas = JsonStorage.load(config.CREATIVE_IDEAS_FILE, []);
  
  const index = ideas.findIndex(i => i.id === ideaId);
  if (index !== -1) {
    const updatedIdea = {
      ...ideas[index],
      ...req.body,
      id: ideaId,
      updatedAt: new Date().toISOString()
    };
    
    // 处理图片：将base64保存为文件（修复：更新时也需要处理图片）
    processCreativeImage(updatedIdea);
    
    ideas[index] = updatedIdea;
    JsonStorage.save(config.CREATIVE_IDEAS_FILE, ideas);
    
    res.json({ success: true, data: updatedIdea });
  } else {
    res.status(404).json({ success: false, error: '创意不存在' });
  }
});

// 删除创意
router.delete('/:id', (req, res) => {
  const ideaId = parseInt(req.params.id);
  const ideas = JsonStorage.load(config.CREATIVE_IDEAS_FILE, []);
  
  const originalLength = ideas.length;
  const filteredIdeas = ideas.filter(i => i.id !== ideaId);
  
  if (filteredIdeas.length < originalLength) {
    JsonStorage.save(config.CREATIVE_IDEAS_FILE, filteredIdeas);
    res.json({ success: true, message: '删除成功' });
  } else {
    res.status(404).json({ success: false, error: '创意不存在' });
  }
});

// 批量导入创意（去重：标题+提示词相同则跳过）
router.post('/import', (req, res) => {
  const newIdeas = req.body.ideas || [];
  const ideas = JsonStorage.load(config.CREATIVE_IDEAS_FILE, []);
  
  // 创建现有创意的特征集合（标题 + 提示词）
  const existingSet = new Set();
  ideas.forEach(idea => {
    const title = (idea.title || '').trim().toLowerCase();
    const prompt = (idea.prompt || '').trim().toLowerCase();
    existingSet.add(`${title}::${prompt}`);
  });
  
  let maxId = Math.max(...ideas.map(i => i.id || 0), 0);
  const imported = [];
  let skipped = 0;
  
  newIdeas.forEach(idea => {
    // 检查是否已存在
    const title = (idea.title || '').trim().toLowerCase();
    const prompt = (idea.prompt || '').trim().toLowerCase();
    const key = `${title}::${prompt}`;
    
    if (existingSet.has(key)) {
      skipped++;
      return;
    }
    
    // 新创意，添加到库中
    maxId++;
    const newIdea = {
      ...idea,
      id: maxId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 处理图片
    processCreativeImage(newIdea);
    
    ideas.push(newIdea);
    imported.push(newIdea);
    existingSet.add(key);
  });
  
  JsonStorage.save(config.CREATIVE_IDEAS_FILE, ideas);
  
  res.json({
    success: true,
    data: imported,
    imported: imported.length,
    skipped: skipped,
    message: `导入成功: ${imported.length} 个新创意${skipped > 0 ? `, 跳过 ${skipped} 个重复` : ''}`
  });
});

// 重新排序创意
router.post('/reorder', (req, res) => {
  const orderedIds = req.body.orderedIds || [];
  const ideas = JsonStorage.load(config.CREATIVE_IDEAS_FILE, []);
  
  // 创建ID到创意的映射
  const idToIdea = {};
  ideas.forEach(idea => {
    idToIdea[idea.id] = idea;
  });
  
  // 按新顺序重排
  const reordered = [];
  orderedIds.forEach((ideaId, index) => {
    if (idToIdea[ideaId]) {
      const idea = idToIdea[ideaId];
      idea.order = index;
      reordered.push(idea);
    }
  });
  
  // 添加未在列表中的创意
  ideas.forEach(idea => {
    if (!orderedIds.includes(idea.id)) {
      reordered.push(idea);
    }
  });
  
  JsonStorage.save(config.CREATIVE_IDEAS_FILE, reordered);
  res.json({ success: true, message: '排序已更新' });
});

module.exports = router;
