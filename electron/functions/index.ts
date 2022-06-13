import * as fs from 'fs'
import { join } from 'path'

import glob from 'glob'

import { appSettingsSchema, tlmIdSchema } from '../../types'

import type { PjSettingsType, PjSettingWithTlmIdType, ResponseDataType, CsvDataType } from '../../types'

// const includeDate = (value: ObjectArrayType | ObjectArrayTypeIncludingDate): value is ObjectArrayTypeIncludingDate => {
//   if ((value as ObjectArrayTypeIncludingDate).DATE !== undefined) {
//     const result = dateArraySchema.safeParse(value.DATE)
//     return result.success
//   }
//   return false
// }

// export const toObjectArray = (records: ArrayObjectType): ObjectArrayTypeIncludingDate | null => {
//   const objectArray: ObjectArrayType = {}
//   const keys = Object.keys(records[0] ?? {})
//   keys.forEach((key) => {
//     objectArray[key] = []
//   })
//   records.forEach((record) => {
//     keys.forEach((key) => {
//       objectArray[key]?.push(record[key] ?? null)
//     })
//   })
//   if (includeDate(objectArray)) {
//     return objectArray
//   }
//   return null
// }

// export const readDbSync = async (path: string, query: string): Promise<ObjectArrayTypeIncludingDate> =>
//   new Promise((resolve) => {
//     const db = new sqlite3.Database(path)
//     db.serialize(() => {
//       db.all(query, (_err, records) => {
//         const schemaResult = arrayObjectSchema.safeParse(records)
//         if (schemaResult.success) {
//           const data = toObjectArray(schemaResult.data)
//           if (data) {
//             resolve(data)
//           }
//         } else {
//           console.log(schemaResult.error.issues)
//         }
//       })
//     })
//   })

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

export const resolvePathGDrive = (path: string): string | null => resolvePath(path, '共有ドライブ', 'Shared drives')

export const getSettings = (topPath: string, pjSettingPath: string) => {
  let pjSettings: PjSettingsType | undefined
  const settingsBeforeParse = JSON.parse(fs.readFileSync(pjSettingPath, 'utf8'))
  const schemaResult = appSettingsSchema.safeParse(settingsBeforeParse)
  if (schemaResult.success) pjSettings = schemaResult.data.project

  if (pjSettings) {
    const pjSettingWithTlmIdList = pjSettings.map((value) => {
      const tlmIdFilePath = resolvePathGDrive(join(topPath, 'settings', value.pjName, 'tlm_id.json'))
      const response: PjSettingWithTlmIdType = value
      if (tlmIdFilePath) {
        const tlmIdSettingsBeforeParse = JSON.parse(fs.readFileSync(tlmIdFilePath, 'utf-8'))
        const tlmIdSchemaResult = tlmIdSchema.safeParse(tlmIdSettingsBeforeParse)
        if (tlmIdSchemaResult.success) {
          response.tlmId = tlmIdSchemaResult.data
        }
        if (value.groundTestPath) {
          const testCaseDirs = glob.sync(join(topPath, value.groundTestPath, '*'))
          const testCaseList = testCaseDirs.map((dir: string) => dir.substring(dir.lastIndexOf('/') + 1))
          if (testCaseList.length !== 0) {
            response.testCase = testCaseList
          }
        }
      }
      return response
    })
    return pjSettingWithTlmIdList
  }
  return null
}

export const convertToCsvData = (responseData: ResponseDataType['tlm']): CsvDataType[] => {
  const tlmNameList = Object.keys(responseData.data)
  const timeList = responseData.time
  return timeList.map((time, index) => {
    const returnData: CsvDataType = { Time: time }
    tlmNameList.forEach((tlmName) => {
      returnData[tlmName] = responseData.data[tlmName]?.[index] ?? null
    })
    return returnData
  })
}
