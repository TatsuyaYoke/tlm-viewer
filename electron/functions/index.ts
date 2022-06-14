import * as fs from 'fs'
import { join } from 'path'

import glob from 'glob'

import { appSettingsSchema, tlmIdSchema } from '../../types'
import { getGroundData } from './getGroundData'
import { getOrbitData } from './getOrbitData'

import type { PjSettingWithTlmIdType, ResponseDataType, CsvDataType, RequestDataType, ApiReturnType } from '../../types'

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

const TOP_PATH_STR = 'G:/Shared drives/0705_Sat_Dev_Tlm'
const TOP_PATH = resolvePathGDrive(TOP_PATH_STR)
const DB_PATH = resolvePathGDrive(join(TOP_PATH_STR, 'db'))
const BIGQUERY_SETTING_PATH = resolvePathGDrive(join(TOP_PATH_STR, 'settings/strix-tlm-bq-reader-service-account.json'))
const PROJECT_SETTING_PATH = resolvePathGDrive(join(TOP_PATH_STR, 'settings/pj-settings.json'))

export const getSettings = (): ApiReturnType<PjSettingWithTlmIdType[]> => {
  if (!TOP_PATH) return { success: false, error: 'Cannot connect GDrive' } as const
  if (!PROJECT_SETTING_PATH) return { success: false, error: 'Not found project setting file' } as const
  const settingsBeforeParse = JSON.parse(fs.readFileSync(PROJECT_SETTING_PATH, 'utf8'))
  const schemaResult = appSettingsSchema.safeParse(settingsBeforeParse)
  if (!schemaResult.success) return { success: false, error: 'Cannot parse project setting file correctly' } as const

  const pjSettings = schemaResult.data.project
  const pjSettingWithTlmIdList = pjSettings.map((value) => {
    const tlmIdFilePath = resolvePathGDrive(join(TOP_PATH, 'settings', value.pjName, 'tlm_id.json'))
    const response: PjSettingWithTlmIdType = value
    if (tlmIdFilePath) {
      const tlmIdSettingsBeforeParse = JSON.parse(fs.readFileSync(tlmIdFilePath, 'utf-8'))
      const tlmIdSchemaResult = tlmIdSchema.safeParse(tlmIdSettingsBeforeParse)
      if (tlmIdSchemaResult.success) {
        response.tlmId = tlmIdSchemaResult.data
      }
      if (value.groundTestPath) {
        const testCaseDirs = glob.sync(join(TOP_PATH, value.groundTestPath, '*'))
        const testCaseList = testCaseDirs.map((dir: string) => dir.substring(dir.lastIndexOf('/') + 1))
        if (testCaseList.length !== 0) {
          response.testCase = testCaseList
        }
      }
    }
    return response
  })
  return {
    success: true,
    data: pjSettingWithTlmIdList,
  } as const
}

const compare = <T extends string | number | null | undefined>(a: T, b: T, desc = true) => {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1

  if (a === undefined && b === undefined) return 0
  if (a === undefined) return 1
  if (b === undefined) return -1

  if (a === '' && b === '') return 0
  if (a === '') return 1
  if (b === '') return -1

  const sig = desc ? 1 : -1
  if (a < b) return sig
  if (a > b) return -sig
  return 0
}

export const convertToCsvData = (responseData: ResponseDataType['tlm']): CsvDataType[] => {
  const tlmNameList = Object.keys(responseData.data)
  const timeList = responseData.time
  const csvData = timeList.map((time, index) => {
    const returnData: CsvDataType = { Time: time }
    tlmNameList.forEach((tlmName) => {
      returnData[tlmName] = responseData.data[tlmName]?.[index] ?? null
    })
    return returnData
  })
  const sortedCsvData = csvData.sort((a, b) => compare(a.Time, b.Time, false))
  return sortedCsvData
}

export const getData = (request: RequestDataType): Promise<ResponseDataType> => {
  if (request.isOrbit) {
    return getOrbitData(request, BIGQUERY_SETTING_PATH)
  }
  return getGroundData(request, DB_PATH)
}
