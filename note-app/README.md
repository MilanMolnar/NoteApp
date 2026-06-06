# NoteMark

A desktop note-taking application built with **Electron**, **React**, and **TypeScript**. Notes are stored as plain Markdown files on your computer — no cloud account, no database. Open the app, pick a note from the sidebar, and edit with a rich Markdown editor that auto-saves as you type.

## Features

- **Local Markdown files** — every note is a `.md` file in a dedicated folder on your machine
- **Rich Markdown editing** — headings, lists, blockquotes, links, images, and code blocks via [MDXEditor](https://mdxeditor.dev/)
- **Auto-save** — changes are saved automatically while you edit, and again when you click away from the editor
- **Sorted note list** — notes appear in the sidebar ordered by most recently edited
- **Native dialogs** — create and delete notes through the operating system's file and confirmation dialogs
- **Frameless window** — a minimal, custom-styled window with a draggable top bar

## Where notes are stored

All notes live in a folder called **`NoteMark`** inside your home directory:

| Platform | Path |
|----------|------|
| Windows  | `C:\Users\<you>\NoteMark\` |
| macOS    | `/Users/<you>/NoteMark/` |
| Linux    | `/home/<you>/NoteMark/` |

Each note is a single file named `<title>.md`. For example, a note titled `Meeting notes` is saved as `Meeting notes.md`.

The folder is created automatically the first time the app needs it. You can also add or edit `.md` files in that folder directly — the app will pick them up the next time it loads the note list.

## Using the app

### Layout

The window is split into two areas:

- **Sidebar (left)** — action buttons at the top, scrollable list of notes below
- **Editor (right)** — the current note's title at the top, Markdown editor below

When no note is selected, the editor shows a placeholder message. When there are no notes at all, the sidebar shows an empty-state message.

### Creating a note

1. Click the **+** button in the top-left of the sidebar.
2. A native **Save** dialog opens with the default name `Untitled.md` in the `NoteMark` folder.
3. Choose a filename and click **Create**.

The new note is created as an empty Markdown file, added to the top of the sidebar, and opened in the editor immediately.

> **Important:** Notes must be saved inside the `NoteMark` folder. If you pick a different location in the dialog, creation is cancelled and an error message is shown.

### Selecting a note

Click any note in the sidebar to open it in the editor. The selected note is highlighted. The editor scroll position resets to the top when you switch notes.

Each entry in the sidebar shows the note title and the date/time it was last edited (formatted using your system locale).

### Editing a note

With a note selected, type directly in the Markdown editor on the right. Supported formatting includes:

- Headings
- Bullet and numbered lists
- Blockquotes
- Links and images
- Code blocks
- Markdown keyboard shortcuts

Changes are saved in two ways:

1. **Auto-save** — after you stop typing, the note is written to disk within a few seconds (debounced).
2. **On blur** — when you click outside the editor, any pending changes are saved immediately.

You do not need to press a save button.

### Deleting a note

1. Select the note you want to remove.
2. Click the **trash** icon next to the **+** button.
3. Confirm in the warning dialog by clicking **Delete**.

The `.md` file is permanently removed from the `NoteMark` folder. If other notes remain, the first note in the list is selected automatically.

## How it works (architecture)

The app follows the standard Electron three-process model:

```
┌─────────────────────────────────────────────────────────┐
│  Renderer (React)                                       │
│  UI, Jotai state, MDXEditor                             │
│         │                                               │
│         │  window.context.*  (contextBridge)            │
├─────────┼───────────────────────────────────────────────┤
│  Preload                                                │
│  Exposes typed IPC wrappers to the renderer             │
│         │                                               │
│         │  ipcRenderer.invoke / ipcMain.handle          │
├─────────┼───────────────────────────────────────────────┤
│  Main process (Node.js)                                 │
│  File I/O, native dialogs (create / delete)             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                   ~/NoteMark/*.md
```

### IPC API

The preload script exposes a `window.context` object to the renderer:

| Method | Description |
|--------|-------------|
| `getNotes()` | Lists all `.md` files in `NoteMark`, returning title and last-modified time |
| `readNote(title)` | Reads the Markdown content of a note |
| `writeNote(title, content)` | Writes content back to the note file |
| `createNote()` | Opens a save dialog and creates a new empty `.md` file |
| `deleteNote(title)` | Shows a confirmation dialog and deletes the note file |

### State management

The renderer uses [Jotai](https://jotai.org/) atoms to manage:

- The list of notes (`notesAtom`) — loaded on startup, sorted by `lastEditTime` descending
- The currently selected note index (`selectedNoteIndexAtom`)
- The selected note's full content (`selectedNoteAtom`) — loaded asynchronously when selection changes
- Actions for create, delete, and save (`createEmptyNoteAtom`, `deleteNoteAtom`, `saveNoteAtom`)

### Key source files

| Path | Role |
|------|------|
| `src/main/index.ts` | Electron entry point, window creation, IPC handlers |
| `src/main/lib/index.ts` | File-system operations and native dialogs |
| `src/preload/index.ts` | Secure bridge between main and renderer |
| `src/renderer/src/store/index.ts` | Jotai atoms and note CRUD logic |
| `src/renderer/src/hooks/useMarkdownEditor.tsx` | Auto-save and editor lifecycle |
| `src/renderer/src/components/MarkdownEditor.tsx` | MDXEditor wrapper |
| `src/shared/constants.ts` | App directory name (`NoteMark`), encoding, auto-save interval |

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

This starts the Electron app with hot module replacement for the renderer.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Preview a production build |
| `npm run build` | Type-check and build for production |
| `npm run build:win` | Build a Windows installer |
| `npm run build:mac` | Build a macOS `.dmg` |
| `npm run build:linux` | Build Linux packages (AppImage, snap, deb) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks for main and renderer |

### Recommended IDE setup

- [VS Code](https://code.visualstudio.com/) with the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension

## Tech stack

- **Electron** — cross-platform desktop shell
- **React 19** — UI
- **TypeScript** — type safety across main, preload, and renderer
- **electron-vite** — build tooling and dev server
- **Jotai** — lightweight state management
- **MDXEditor** — WYSIWYG Markdown editor
- **Tailwind CSS** — styling
- **fs-extra** — file-system helpers in the main process
