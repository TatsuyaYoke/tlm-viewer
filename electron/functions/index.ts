import * as fs from 'fs'
import sqlite3 from 'sqlite3'
import { DataType, ObjectArrayType } from 'types'

type ArrayObjectType = {
  DATE: Date
  [key: string]: DataType
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

type ResolvePath = (path: string, resolveName1: string, resolveName2: string) => string | null

export const resolvePath: ResolvePath = (path, resolveName1, resolveName2) => {
  if (fs.existsSync(path)) return path
  let resolvedPath = ''
  if (path.indexOf(resolveName1) !== -1) {
    resolvedPath = path.replace(resolveName1, resolveName2)
    if (fs.existsSync(resolvedPath)) return resolvedPath
  }
  if (path.indexOf(resolveName2) !== -1) {
    resolvedPath = path.replace(resolveName2, resolveName1)
    if (fs.existsSync(resolvedPath)) return resolvedPath
  }
  return null
}
