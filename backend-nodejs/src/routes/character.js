const express = require('express');
const config = require('../config');
const CharacterStorage = require('../utils/characterStorage');

const router = express.Router();

// 初始化角色存储
let characterStorage;

function getCharacterStorage() {
  if (!characterStorage) {
    characterStorage = new CharacterStorage(config.DATA_DIR);
  }
  return characterStorage;
}

// 获取所有角色
router.get('/', (req, res) => {
  try {
    const { platform, favorite, search, limit, skip } = req.query;

    const options = {};
    if (platform) options.platform = platform;
    if (favorite === 'true') options.favorite = true;
    if (search) options.searchQuery = search;
    if (limit) options.limit = parseInt(limit);
    if (skip) options.skip = parseInt(skip);

    const storage = getCharacterStorage();
    const characters = storage.getAllCharacters(options);

    res.json({ success: true, data: characters, total: characters.length });
  } catch (error) {
    console.error('获取角色列表失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取单个角色
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const storage = getCharacterStorage();
    const character = storage.getCharacter(id);

    if (!character) {
      return res.status(404).json({ success: false, error: '角色不存在' });
    }

    res.json({ success: true, data: character });
  } catch (error) {
    console.error('获取角色失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加角色
router.post('/', (req, res) => {
  try {
    const character = req.body;

    if (!character.id) {
      return res.status(400).json({ success: false, error: '角色 ID 不能为空' });
    }

    const storage = getCharacterStorage();
    const result = storage.addCharacter(character);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('添加角色失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新角色
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const storage = getCharacterStorage();
    const result = storage.updateCharacter(id, updates);

    if (!result) {
      return res.status(404).json({ success: false, error: '角色不存在' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('更新角色失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除角色
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const storage = getCharacterStorage();
    const success = storage.deleteCharacter(id);

    if (!success) {
      return res.status(404).json({ success: false, error: '角色不存在' });
    }

    res.json({ success: true, message: '角色已删除' });
  } catch (error) {
    console.error('删除角色失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 搜索角色
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const storage = getCharacterStorage();
    const characters = storage.searchCharacters(query);

    res.json({ success: true, data: characters, total: characters.length });
  } catch (error) {
    console.error('搜索角色失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取统计信息
router.get('/stats/summary', (req, res) => {
  try {
    const storage = getCharacterStorage();
    const stats = storage.getStats();

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 批量导入角色
router.post('/import', (req, res) => {
  try {
    const { characters } = req.body;

    if (!Array.isArray(characters)) {
      return res.status(400).json({ success: false, error: '导入数据格式错误' });
    }

    const storage = getCharacterStorage();
    const results = [];

    for (const character of characters) {
      const result = storage.addCharacter(character);
      results.push(result);
    }

    res.json({ success: true, data: results, imported: results.length });
  } catch (error) {
    console.error('批量导入角色失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 清空所有角色
router.delete('/', (req, res) => {
  try {
    const storage = getCharacterStorage();
    storage.clearAll();

    res.json({ success: true, message: '所有角色已清空' });
  } catch (error) {
    console.error('清空角色失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
