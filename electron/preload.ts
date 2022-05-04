import { ipcRenderer, contextBridge } from 'electron'
import { join } from 'path'

import { readDbSync, resolvePathGdrive, getTestCaseList, getSettings } from './functions'

import type { apiReturnType, ObjectArrayTypeIncludingDate } from '../types'

declare global {
  interface Window {
    Main: typeof api
    ipcRenderer: typeof ipcRenderer
  }
}

const TOP_PATH = 'G:/Shared drives/0705_Sat_Dev_Tlm'
// const DB_NAME = 'system_test.db'
const PROJECT_SETTING_RELATIVE_PATH = 'settings/pj-settings.json'

const api = {
  getData: async (path: string, query: string): Promise<apiReturnType<ObjectArrayTypeIncludingDate, string>> => {
    const resolvedPath = resolvePathGdrive(path)
    if (resolvedPath) {
      const data = await readDbSync(resolvedPath, query)
      return {
        success: true,
        data: data,
      }
    }

    return {
      success: false,
      error: 'cannot find database',
    }
  },
  getTestCaseList: (project: string) => {
    const topPath = resolvePathGdrive(TOP_PATH)
    const pjSettingPath = resolvePathGdrive(join(TOP_PATH, PROJECT_SETTING_RELATIVE_PATH))
    if (topPath && pjSettingPath) {
      return getTestCaseList(topPath, pjSettingPath, project)
    }
    return null
  },
  getSettngs: () => {
    const topPath = resolvePathGdrive(TOP_PATH)
    const pjSettingPath = resolvePathGdrive(join(TOP_PATH, PROJECT_SETTING_RELATIVE_PATH))
    if (topPath && pjSettingPath) {
      return getSettings(topPath, pjSettingPath)
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
