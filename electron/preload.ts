import { ipcRenderer, contextBridge } from 'electron'
import { join } from 'path'

import { readDbSync, resolvePathGdrive, getTestCaseList, getSettings } from './functions'

import type { Main } from '../types'

const TOP_PATH = 'G:/Shared drives/0705_Sat_Dev_Tlm'
// const DB_NAME = 'system_test.db'
const PROJECT_SETTING_RELATIVE_PATH = 'settings/pj-settings.json'

export const api: Main = {
  getData: async (path, query) => {
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
  getTestCaseList: (project) => {
    const topPath = resolvePathGdrive(TOP_PATH)
    const pjSettingPath = resolvePathGdrive(join(TOP_PATH, PROJECT_SETTING_RELATIVE_PATH))
    if (topPath && pjSettingPath) {
      return getTestCaseList(topPath, pjSettingPath, project)
    }
    return null
  },
  getSettings: () => {
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
}

contextBridge.exposeInMainWorld('Main', api)
