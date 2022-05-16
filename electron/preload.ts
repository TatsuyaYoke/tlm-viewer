import { ipcRenderer, contextBridge } from 'electron'
import { join } from 'path'

import { readDbSync, resolvePathGdrive, getSettings } from './functions'

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
      error: 'Database not found',
    }
  },
  getSettings: () => {
    const topPath = resolvePathGdrive(TOP_PATH)
    const pjSettingPath = resolvePathGdrive(join(TOP_PATH, PROJECT_SETTING_RELATIVE_PATH))

    if (!topPath)
      return {
        success: false,
        error: 'Cannot connect Gdrive',
      }

    if (!pjSettingPath)
      return {
        success: false,
        error: `${PROJECT_SETTING_RELATIVE_PATH} not found`,
      }

    const response = getSettings(topPath, pjSettingPath)
    if (!response)
      return {
        success: false,
        error: `Cannot parse ${PROJECT_SETTING_RELATIVE_PATH} correctly`,
      }

    return {
      success: true,
      data: response,
    }
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
