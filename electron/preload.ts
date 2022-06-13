import { ipcRenderer, contextBridge } from 'electron'
import { join } from 'path'

import { resolvePathGDrive, getSettings } from './functions'

import type { Main, MyIpcChannelDataType, MyIpcChannelType } from '../types'

const TOP_PATH = 'G:/Shared drives/0705_Sat_Dev_Tlm'
// const DB_NAME = 'system_test.db'
const PROJECT_SETTING_RELATIVE_PATH = 'settings/pj-settings.json'

const myIpcRenderer = {
  invoke: async <T extends MyIpcChannelType>(
    channel: T,
    args?: Parameters<MyIpcChannelDataType[T]>[0]
  ): Promise<Awaited<ReturnType<MyIpcChannelDataType[T]>>> => ipcRenderer.invoke(channel, args),
}

export const api: Main = {
  // getData: async (path, query) => {
  //   const resolvedPath = resolvePathGDrive(path)
  //   if (resolvedPath) {
  //     const data = await readDbSync(resolvedPath, query)
  //     return {
  //       success: true,
  //       data: data,
  //     }
  //   }

  //   return {
  //     success: false,
  //     error: 'Database not found',
  //   }
  // },
  getSettings: () => {
    const topPath = resolvePathGDrive(TOP_PATH)
    const pjSettingPath = resolvePathGDrive(join(TOP_PATH, PROJECT_SETTING_RELATIVE_PATH))

    if (!topPath)
      return {
        success: false,
        error: 'Cannot connect GDrive',
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
    myIpcRenderer.invoke('Minimize')
  },
  Maximize: () => {
    myIpcRenderer.invoke('Maximize')
  },
  Close: () => {
    myIpcRenderer.invoke('Close')
  },
  openFileDialog: () => myIpcRenderer.invoke('openFileDialog'),
  saveFile: (data) => myIpcRenderer.invoke('saveFile', data),
  isMaximize: () => myIpcRenderer.invoke('isMaximize'),
  // sendMessage: (message) => ipcRenderer.send('message', message),
  // on: (channel: string, callback: (data: any) => void) => {
  //   ipcRenderer.on(channel, (_, data) => callback(data))
  // },
}

contextBridge.exposeInMainWorld('Main', api)
