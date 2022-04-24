import { ipcRenderer, contextBridge } from 'electron'
import { readDbSync, resolvePath } from './functions'

declare global {
  interface Window {
    Main: typeof api
    ipcRenderer: typeof ipcRenderer
  }
}

const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sayHello`
   */
  getData: async (path: string, query: string) => {
    const resolvedPath = resolvePath(path, '共有ドライブ', 'Shared drives')
    if (resolvedPath) {
      const data = await readDbSync(resolvedPath, query)
      return data
    }
    return null
  },
  /**
    Here function for AppBar
   */
  Minimize: () => {
    ipcRenderer.send('minimize')
  },
  Maximize: () => {
    ipcRenderer.send('maximize')
  },
  Close: () => {
    ipcRenderer.send('close')
  },
  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}
contextBridge.exposeInMainWorld('Main', api)
