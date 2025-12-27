const fs = require('fs');
const path = require('path');

// Correct path: Root/data/characters.json
// Assuming this script is in Root/backend-nodejs/scripts
const CHARACTERS_FILE = path.resolve(__dirname, '..', '..', 'data', 'characters.json');

console.log('Target file:', CHARACTERS_FILE);

const newChar = {
  id: 'char_manual_test_01',
  username: 'PenguinTester',
  permalink: 'https://example.com/penguin',
  profile_picture_url: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png', // Penguin icon
  video_url: 'https://midjourney-plus.oss-us-west-1.aliyuncs.com/sora/1b21d6d6-4c29-498c-b71a-943e5d27e841.mp4'
};

let characters = [];
if (fs.existsSync(CHARACTERS_FILE)) {
  const content = fs.readFileSync(CHARACTERS_FILE, 'utf8');
  if (content.trim()) {
      try {
        characters = JSON.parse(content);
      } catch (e) {
          console.error('Error parsing JSON:', e);
      }
  }
} else {
    console.log('File does not exist, creating new one.');
}

// Check if exists
const idx = characters.findIndex(c => c.id === newChar.id);
if (idx >= 0) {
  characters[idx] = newChar;
} else {
  characters.push(newChar);
}

fs.writeFileSync(CHARACTERS_FILE, JSON.stringify(characters, null, 2));
console.log('Successfully injected character:', newChar.username);
