# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Penguin Magic (企鹅工坊)** is a desktop-class AI image creative management application - the world's first AI image desktop management tool. It combines AI image generation with a visual desktop workspace for organizing and managing creative content.

### Architecture

This is a **three-tier Electron application**:

1. **Frontend (React + TypeScript + Vite)** - Located at project root
   - Entry: `index.tsx` → `App.tsx` (3,746 lines)
   - Canvas/workflow system using `@xyflow/react` (React Flow)
   - Desktop-like workspace with drag-and-drop

2. **Backend (Node.js + Express)** - Located in `backend-nodejs/`
   - Entry: `backend-nodejs/src/server.js` (181 lines)
   - RESTful API with 8 route modules
   - File-based JSON storage in `backend-nodejs/data/`
   - Image processing with Sharp

3. **Desktop Layer (Electron)** - Located in `electron/`
   - Main process: `electron/main.cjs` (1,539 lines)
   - Manages backend server lifecycle
   - Auto-update from `http://updates.pebbling.cn/`

### Key Directories

```
├── components/          # React components (27 files)
│   ├── Canvas/         # Canvas/node-based workflow components
│   ├── Desktop/        # Desktop workspace (Desktop.tsx: 2,471 lines)
│   └── nodes/          # 6 node types for canvas
├── services/           # Business logic
│   ├── api/           # API client layer (9 modules)
│   ├── geminiService.ts
│   ├── pebblingGeminiService.ts
│   ├── veoService.ts  # Video generation
│   └── soraService.ts # Video generation
├── backend-nodejs/
│   └── src/routes/    # API routes (8 files)
├── electron/          # Electron main process
├── types.ts           # Core type definitions (314 lines)
└── App.tsx            # Main app component
```

## Development Commands

### Initial Setup
```bash
npm install
cd backend-nodejs && npm install && cd ..
```

### Development (Windows batch files also available)
```bash
# Start Vite dev server (port 5176)
npm run dev

# Start Electron in development mode
npm run electron:dev

# Start backend only
cd backend-nodejs && npm start
```

### Building
```bash
# Build frontend for production
npm run build

# Build Electron app
npm run electron:build

# Package for current platform
npm run package        # Windows only
npm run package:all    # Win/Mac/Linux
```

### Testing Backend
```bash
# Backend runs on http://localhost:8765
# Frontend dev server proxies /api, /files, /input, /output to backend
```

## Core Concepts

### Data Storage
All data is stored as JSON files in `backend-nodejs/data/`:
- `creative_ideas.json` - Creative templates
- `history.json` - Generation history (max 500 items)
- `settings.json` - App settings
- `desktop_items.json` - Desktop state
- `canvas_list.json` - Canvas/workflow list

Images are stored in:
- `input/` - User uploaded images
- `output/` - Generated images
- `thumbnails/` - Thumbnail cache (160px, 80% quality)
- `creative_images/` - Creative template images

### Desktop System
The desktop (`components/Desktop.tsx`) supports three item types:
- **Image items** - Individual images with position, prompt, model info
- **Folder items** - Containers that organize multiple items
- **Stack items** - Mac-style stacked display for grouped images

Grid-based positioning with drag-and-drop, multi-selection support.

### Canvas/Workflow System
Node-based visual programming using `@xyflow/react`:
- Node types: TextNode, ImageNode, PromptNode, CreativeNode, SaveImageNode, MultiAngleNode
- Stored in `CreativeIdea.isWorkflow` with nodes/connections
- RunningHub integration for external workflows

### AI Service Integration
- **Google Gemini** - `services/geminiService.ts`
- **Pebbling** - `services/pebblingGeminiService.ts`
- **Veo/Sora** - Video generation services
- **Third-party APIs** - Configurable via settings

### Creative Library System
Templates support multiple modes:
- **Smart** - Simple variable substitution
- **SmartPlus** - Feature toggles
- **BP (Blueprint)** - Agent fields with LLM-powered inputs
- **RunningHub** - External workflow integration
- **Workflow** - Native canvas node-based workflows

## Type System (types.ts)

Key types defined in `types.ts`:
- `CreativeIdea` - Creative template with multiple mode support
- `DesktopItem` - Union type for desktop items
- `GeneratedContent` - AI generation result
- `WorkflowNode/Connection` - Canvas workflow types
- `ThirdPartyApiConfig` - External API configuration
- `RunningHubConfig` - Workflow integration settings

Enums:
- `ApiStatus`: Idle, Loading, Success, Error
- `AspectRatioType`: Auto, 4:3, 16:9, 1:1, etc.
- `ImageSizeType`: 1K, 2K, 4K
- `CreativeCategoryType`: character, scene, product, art, tool, other
- `WorkflowNodeType`: text, image, idea, edit, video, llm, resize, relay, remove-bg, upscale

## API Routes (backend-nodejs/src/routes/)

- `creative.js` - Creative ideas CRUD
- `history.js` - Generation history (max 500)
- `files.js` - File upload/management
- `settings.js` - Application settings
- `desktop.js` - Desktop state persistence
- `imageOps.js` - Image operations (merge, crop, resize)
- `canvas.js` - Canvas/workflow data

## Configuration

### vite.config.ts
- Base path: `./` (for Electron)
- Dev server: port 5176
- Backend proxy: `/api`, `/files`, `/input`, `/output` → localhost:8765
- Path alias: `@/*` → project root

### Electron Build
- Version from `package.json`
- Auto-update: `http://updates.pebbling.cn/`
- Builder: electron-builder (Win: NSIS, Mac: DMG, Linux: AppImage)

### Environment
- `GEMINI_API_KEY` - Google AI API key (optional)
- Development data: Project directory
- Production data: `%APPDATA%/penguin-magic` (Windows)

## Important Notes

- **No tests are configured** - When adding features, manually test through the UI
- **Chinese language** - UI and comments are primarily in Chinese
- **File-based storage** - No database, all JSON files
- **Electron lifecycle** - Backend starts before main window, stops on app quit
- **History limit** - Generation history capped at 500 items
- **Thumbnail generation** - Automatic, 160px width, 80% quality

## Common Tasks

### Adding a new canvas node type
1. Add type to `WorkflowNodeType` in `types.ts`
2. Create component in `components/Canvas/nodes/`
3. Register in `components/PebblingCanvas/`
4. Handle in workflow execution logic

### Adding a new API route
1. Create router in `backend-nodejs/src/routes/`
2. Register in `backend-nodejs/src/server.js`
3. Add API client in `services/api/`
4. Use in components via hooks/context

### Adding creative library mode
1. Extend `CreativeIdea` interface in `types.ts`
2. Add UI handling in creative library component
3. Implement prompt generation logic in services
4. Update backend creative route if needed
