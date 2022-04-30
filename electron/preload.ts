import { ipcRenderer, contextBridge } from 'electron'
import path from 'path'
import { readDbSync, resolvePath, getTestCaseList } from './functions'

declare global {
  interface Window {
    Main: typeof api
    ipcRenderer: typeof ipcRenderer
  }
}

const TOP_PATH = 'G:/Shared drives/0705_Sat_Dev_Tlm'
// const DB_NAME = 'system_test.db'
const PROJECT_SETTING_NAME = 'pj-settings.json'
const resolvePathGdrive = (inputPath: string): string | null => resolvePath(inputPath, '共有ドライブ', 'Shared drives')

const api = {
  getData: async (dbPath: string, query: string) => {
    const resolvedPath = resolvePathGdrive(dbPath)
    if (resolvedPath) {
      const data = await readDbSync(resolvedPath, query)
      return data
    }
    return null
  },
  getTestCaseList: (project: string) => {
    const topPath = resolvePathGdrive(TOP_PATH)
    const pjSettingPath = resolvePathGdrive(path.join(TOP_PATH, PROJECT_SETTING_NAME))
    if (topPath && pjSettingPath) {
      return getTestCaseList(topPath, pjSettingPath, project)
    }
    return null
  },
  Minimize: () => {
    ipcRenderer.send('minimize')
  },
  Maximize: () => {
    ipcRenderer.send('maximize')
  },
  Close: () => {
    ipcRenderer.send('close')
  },
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}
contextBridge.exposeInMainWorld('Main', api)
