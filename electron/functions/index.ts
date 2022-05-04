import * as fs from 'fs'
import { join } from 'path'

import glob from 'glob'
import sqlite3 from 'sqlite3'

import { arrayObjectSchema, dateArraySchema, appSettingsSchema, tlmIdSchema } from '../../types'

import type {
  ObjectArrayType,
  ObjectArrayTypeIncludingDate,
  ArrayObjectType,
  pjSettingsType,
  pjSettingWithTlmIdType,
} from '../../types'

export const isNotNull = <T>(item: T): item is Exclude<T, null> => item !== null
export const isNotUndefined = <T>(item: T): item is Exclude<T, undefined> => item !== undefined

const includeDate = (value: ObjectArrayType | ObjectArrayTypeIncludingDate): value is ObjectArrayTypeIncludingDate => {
  if ((value as ObjectArrayTypeIncludingDate).DATE !== undefined) {
    const result = dateArraySchema.safeParse(value.DATE)
    return result.success
  }
  return false
}

export const toObjectArray = (records: ArrayObjectType): ObjectArrayTypeIncludingDate | null => {
  const objectArray: ObjectArrayType = {}
  const keys = Object.keys(records[0] ?? {})
  keys.forEach((key) => {
    objectArray[key] = []
  })
  records.forEach((record) => {
    keys.forEach((key) => {
      objectArray[key]?.push(record[key] ?? null)
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

export const resolvePathGdrive = (path: string): string | null => resolvePath(path, '共有ドライブ', 'Shared drives')

export const getTestCaseList = (topPath: string, filePath: string, project: string): string[] => {
  const pjSettings = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  console.log(project)
  const files = glob.sync(join(topPath, pjSettings.project[0].groundTestPath, '*'))
  const testCaseList = files.map((file: string) => file.substring(file.lastIndexOf('/') + 1))
  return testCaseList
}

export const getSettings = (topPath: string, pjSettingPath: string) => {
  let pjSettings: pjSettingsType | undefined
  const settingsBeforeParse = JSON.parse(fs.readFileSync(pjSettingPath, 'utf8'))
  const schemaResult = appSettingsSchema.safeParse(settingsBeforeParse)
  if (schemaResult.success) {
    pjSettings = schemaResult.data.project
  }

  if (pjSettings) {
    const pjSettingWithTlmIdList = pjSettings.map((value) => {
      const tlmIdfilePath = resolvePathGdrive(join(topPath, 'settings', value.pjName, 'tlm_id.json'))
      const response: pjSettingWithTlmIdType = value
      if (tlmIdfilePath) {
        const tlmIdsettingsBeforeParse = JSON.parse(fs.readFileSync(tlmIdfilePath, 'utf-8'))
        const tlmIdSchemaResult = tlmIdSchema.safeParse(tlmIdsettingsBeforeParse)
        if (tlmIdSchemaResult.success) {
          response.tlmId = tlmIdSchemaResult.data
        }
      }
      return response
    })
    return pjSettingWithTlmIdList
  }
  return null
}
