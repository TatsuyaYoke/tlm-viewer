import glob from 'glob'
import { join } from 'path'
import * as fs from 'fs'
import sqlite3 from 'sqlite3'
import type { ObjectArrayType, ObjectArrayTypeIncludingDate, ArrayObjectType } from '../../types'
import { arrayObjectSchema, dateArraySchema } from '../../types'

const includeDate = (value: ObjectArrayType | ObjectArrayTypeIncludingDate): value is ObjectArrayTypeIncludingDate => {
  if ((value as ObjectArrayTypeIncludingDate).DATE !== undefined) {
    const result = dateArraySchema.safeParse(value.DATE)
    return result.success
  }
  return false
}

export const toObjectArray = (records: ArrayObjectType): ObjectArrayTypeIncludingDate | null => {
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
  if (includeDate(objectArray)) {
    return objectArray
  }
  return null
}

export const readDbSync = async (path: string, query: string): Promise<ObjectArrayTypeIncludingDate> =>
  new Promise((resolve) => {
    const db = new sqlite3.Database(path)
    db.serialize(() => {
      db.all(query, (_err, records) => {
        const schemaResult = arrayObjectSchema.safeParse(records)
        if (schemaResult.success) {
          const data = toObjectArray(schemaResult.data)
          if (data) {
            resolve(data)
          }
        } else {
          console.log(schemaResult.error.issues)
        }
      })
    })
  })

export const resolvePath = (path: string, resolveName1: string, resolveName2: string): string | null => {
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

export const getTestCaseList = (topPath: string, filePath: string, project: string): string[] => {
  const pjSettings = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const files = glob.sync(join(topPath, pjSettings[project].groundTestPath, '*'))
  const testCaseList = files.map((file: string) => file.substring(file.lastIndexOf('/') + 1))
  return testCaseList
}
