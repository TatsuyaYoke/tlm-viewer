import { ipcRenderer, contextBridge } from 'electron'
import sqlite3 from 'sqlite3'

const toObjectArray = (records: any) => {
  const objectArray: any = {}
  const keys = Object.keys(records[0])
  keys.forEach((key) => {
    objectArray[key] = []
  })
  records.forEach((record: any) => {
    keys.forEach((key) => {
      objectArray[key].push(record[key])
    })
  })
  return objectArray
}

const readDbSyns = async (path: string) =>
  new Promise((resolve) => {
    const db = new sqlite3.Database(path)
    db.serialize(() => {
      db.all(
        "select distinct DATE, PCDU_BAT_VOLTAGE, PCDU_BAT_CURRENT from DSX0201_tlm_id_1 where DATE between '2022-04-18' and '2022-04-19'",
        (_err, records) => {
          const data = toObjectArray(records)
          resolve(data)
        }
      )
    })
  })

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
  sendMessage: (message: string) => {
    ipcRenderer.send('message', message)
  },
  getData: async () => {
    const data = await readDbSyns('G:/共有ドライブ/0705_Sat_Dev_Tlm/system_test.db')
    ipcRenderer.send('data', data)
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
/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
