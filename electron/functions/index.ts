import sqlite3 from 'sqlite3'

type DataType = Date | number | null

type ArrayObjectType = {
  [key in string]: DataType
}

export type ObjectArrayType = {
  [key in string]: DataType[]
}

type ToObjectArray = (records: ArrayObjectType[]) => ObjectArrayType

export const toObjectArray: ToObjectArray = (records) => {
  const objectArray: ObjectArrayType = {}
  const keys = Object.keys(records[0])
  keys.forEach((key) => {
    objectArray[key] = []
  })
  records.forEach((record) => {
    keys.forEach((key) => {
      objectArray[key].push(record[key])
    })
  })
  return objectArray
}

type ReadDbSync = (path: string, query: string) => Promise<ObjectArrayType>

export const readDbSync: ReadDbSync = async (path, query) =>
  new Promise((resolve) => {
    const db = new sqlite3.Database(path)
    db.serialize(() => {
      db.all(query, (_err, records) => {
        const data = toObjectArray(records)
        resolve(data)
      })
    })
  })
