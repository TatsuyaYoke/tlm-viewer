// import glob from 'glob'
// import path from 'path'
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

type ReadDbSync = (dbPath: string, query: string) => Promise<ObjectArrayType>

export const readDbSync: ReadDbSync = async (dbPath, query) =>
  new Promise((resolve) => {
    const db = new sqlite3.Database(dbPath)
    db.serialize(() => {
      db.all(query, (_err, records) => {
        const data = toObjectArray(records)
        resolve(data)
      })
    })
  })

type ResolvePath = (initialPath: string, resolveName1: string, resolveName2: string) => string | null

export const resolvePath: ResolvePath = (initialPath, resolveName1, resolveName2) => {
  if (fs.existsSync(initialPath)) return initialPath
  let resolvedPath = ''
  if (initialPath.indexOf(resolveName1) !== -1) {
    resolvedPath = initialPath.replace(resolveName1, resolveName2)
    if (fs.existsSync(resolvedPath)) return resolvedPath
  }
  if (initialPath.indexOf(resolveName2) !== -1) {
    resolvedPath = initialPath.replace(resolveName2, resolveName1)
    if (fs.existsSync(resolvedPath)) return resolvedPath
  }
  return null
}

type PjSettingsJosnType = {
  [key: string]: {
    groundTestPath: string
  }
}

type GetPjSettingsJoson = (filePath: string) => PjSettingsJosnType

export const getPjSettingsJson: GetPjSettingsJoson = (filePath) => {
  const pjSettings = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return pjSettings
}
