
import { deleteNote } from '@/lib'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'


if (!process.contextIsolated) {
  throw new Error('Context Isolation must be enabled in the main process!')
}

try {
  // Expose protected methods that allow the renderer process to use
  // the ipcRenderer without exposing the entire object
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,

    getNotes: (...args: Parameters<GetNotes>) => {
      return ipcRenderer.invoke('getNotes', ...args)
    },
    readNote: (...args: Parameters<ReadNote>) => {
      return ipcRenderer.invoke('readNote', ...args)
    },
    writeNote: (...args: Parameters<WriteNote>) =>{
      return ipcRenderer.invoke('writeNote', ...args)
    },
    createNote: (...args: Parameters<CreateNote>) =>{
      return ipcRenderer.invoke('createNote', ...args)
    },
    deleteNote: (...args: Parameters<DeleteNote>) =>{
      return ipcRenderer.invoke('deleteNote', ...args)
    },
  })
} catch (error) {
  console.error('Failed to expose context bridge:', error)
}