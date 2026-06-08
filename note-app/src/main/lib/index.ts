import { appDirectory, fileEncoding, onboardingNoteName } from "@shared/constants"
import { NoteContent, NoteInfo } from "@shared/models"
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from "@shared/types"
import { dialog } from "electron"
import { ensureDir, readdir, readFile, remove, stat, writeFile } from "fs-extra"
import { homedir } from "os"
import path from "path"
import {isEmpty} from 'lodash'
import welcomeNoteFile from '../../../resources/welcome-note.md?asset'


export const separator = (): string => { 
  if (process.platform === 'win32')
    return "\\" 
  return "/"
}
export const getRootDir = () => {
    return `${homedir()}${separator()}${appDirectory}`
}


export const getNotes: GetNotes = async () => {
    const rootDir = getRootDir()
    await ensureDir(rootDir)
    const notesFileNames = await readdir(rootDir, {
        encoding: fileEncoding,
        withFileTypes: false,
    })
    
    const notes = notesFileNames.filter((fileName) => fileName.endsWith(".md"))

    if (isEmpty(notes)){
        console.info("no notes")

        const content = await readFile(welcomeNoteFile, {encoding: fileEncoding})

        console.info(content)

        await writeFile(`${getRootDir()}${separator()}${onboardingNoteName}`, content, {encoding: fileEncoding})

        notes.push(onboardingNoteName)
    }

    return Promise.all(notes.map((getNoteInfoFromFileName)))
}

export const getNoteInfoFromFileName = async (fileName: string): Promise<NoteInfo> => {
    const fileStats = await stat(`${getRootDir()}${separator()}${fileName}`)
    
    return {
        title: fileName.replace(".md", ""),
        lastEditTime: fileStats.mtimeMs,
    }
}

export const readNote: ReadNote = async (filename) => {
    const rootDir = getRootDir()


    const content = await readFile(`${rootDir}${separator()}${filename}.md`, {encoding:fileEncoding}) 

    const noteContent: NoteContent = typeof content === 'string' ? { content } : content
    return noteContent
}

export const writeNote: WriteNote = async (filename, content) =>{
    const rootDir = getRootDir()
    
    console.info(`Writing note ${filename}`)
    return writeFile(
        `${rootDir}${separator()}${filename}.md`,
        content.content,
        { encoding: fileEncoding }
      )
}

export const createNote:CreateNote= async () =>{
    const rootDir = getRootDir()
    await ensureDir(rootDir)



    const {filePath, canceled} = await dialog.showSaveDialog({
        title: 'New note',
        defaultPath: `${rootDir}${separator()}Untitled.md`,
        buttonLabel: 'Create',
        properties: ['showOverwriteConfirmation'],
        showsTagField: false,
        filters:[
            {name: 'Markdown', extensions: ['md']}
        ]
    })
    if (canceled){
        console.info('note creation canceled')
        return false
    }
    const {name: filename, dir: parendDir} = path.parse(filePath)

    if (parendDir !== rootDir){
        dialog.showMessageBox({
            type: 'error',
            title: 'Creation Failed',
            message: `All notes must be saved under ${rootDir}`
        })
        return false
    }

    console.info('creating note')
    await writeFile(filePath, '')

    return filename
}

export const deleteNote: DeleteNote = async (filename) =>{
    const rootDir = getRootDir()

     const {response} = await dialog.showMessageBox({
        type: 'warning',
        title: 'delete note',
        message: `Are you sure you want to delete ${filename}`,
        buttons: ['Delete', 'Cancel'],
        defaultId: 1,
        cancelId: 1,
    })

    if(response == 1){
        console.info("delete canceled")
        return false
    }

    console.info('deleting note')

    await remove(`${rootDir}${separator()}${filename}.md`)

    return true
}