import * as z from 'zod'

import type { MultiValue } from 'chakra-react-select'

export const isNotNull = <T>(item: T): item is Exclude<T, null> => item !== null
export const isNotUndefined = <T>(item: T): item is Exclude<T, undefined> => item !== undefined
export const isNotString = <T>(item: T): item is Exclude<T, string> => typeof item !== 'string'
export const isNotNumber = <T>(item: T): item is Exclude<T, number> => typeof item !== 'number'

export type MyIpcChannelDataType = {
  Maximize: () => void
  Minimize: () => void
  Close: () => void
  openFileDialog: () => Promise<string | undefined>
  saveFile: (
    data: TlmDataObjectType['tlm']
  ) => Promise<{ success: true; path: string } | { success: false; error: string }>
  isMaximize: () => Promise<boolean>
  // sendMessage: (message: string) => void
  // on: (channel: string, callback: (data: any) => void) => void
}
export type MyIpcChannelType = keyof MyIpcChannelDataType

export type Main = MyIpcChannelDataType & {
  getData: (path: string, query: string) => Promise<apiReturnType<ObjectArrayTypeIncludingDate>>
  getSettings: () => apiReturnType<pjSettingWithTlmIdType[]>
}

declare global {
  interface Window {
    Main: Main
  }
}

export type selectOptionType = {
  label: string
  value: string
}

export type tlmListType = {
  id: number
  tlm: MultiValue<selectOptionType>
}

export const dataTypeSchema = z.union([z.number().nullable(), z.string()])
export const objectTypeSchema = z.record(dataTypeSchema)
export const arrayObjectSchema = z.array(objectTypeSchema)
export const objectArrayTypeSchema = z.record(z.array(dataTypeSchema))
export const objectArrayTypeIncludeDateSchema = z.object({ DATE: z.array(z.string()) }).and(objectArrayTypeSchema)
const regexDateTime = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/
export const dateArraySchema = z.array(z.string().regex(regexDateTime))

export type ArrayObjectType = z.infer<typeof arrayObjectSchema>
export type ObjectType = z.infer<typeof objectTypeSchema>
export type DataType = z.infer<typeof dataTypeSchema>
export type ObjectArrayType = z.infer<typeof objectArrayTypeSchema>
export type ObjectArrayTypeIncludingDate = z.infer<typeof objectArrayTypeIncludeDateSchema>
export type DateArrayType = z.infer<typeof dateArraySchema>

export const pjNameSchema = z.string().regex(/^DSX[0-9]{4}/)
export const groundTestPathSchema = z.string()
export const orbitDatasetPathSchema = z.string().regex(/^syns-sol-grdsys-external-prod.strix_/)

export const pjSettingSchema = z.union([
  z.object({
    pjName: pjNameSchema,
    groundTestPath: groundTestPathSchema.optional(),
    orbitDatasetPath: orbitDatasetPathSchema,
  }),
  z.object({
    pjName: pjNameSchema,
    groundTestPath: groundTestPathSchema,
    orbitDatasetPath: orbitDatasetPathSchema.optional(),
  }),
])
export const pjSettingsSchema = z.array(pjSettingSchema)
export const appSettingsSchema = z.object({
  project: pjSettingsSchema,
})

export type pjSettingType = z.infer<typeof pjSettingSchema>
export type pjSettingsType = z.infer<typeof pjSettingsSchema>
export type pjSettingsKeyType = keyof pjSettingType
export type appSettingsType = z.infer<typeof appSettingsSchema>

export const tlmIdSchema = z.record(z.number())
export type tlmIdType = z.infer<typeof tlmIdSchema>
export type pjSettingWithTlmIdType = pjSettingType & {
  tlmId?: tlmIdType
  testCase?: string[]
}

export type apiSuccess<T> = { success: true; data: T }
export type apiError = { success: false; error: string }
export type apiReturnType<T> = apiSuccess<T> | apiError

export type dateSettingType = {
  startDate: Date
  endDate: Date
}
export type requestTlmType = {
  tlmId: number
  tlmList: string[]
}
export type requestDataType = {
  project: string
  isOrbit: boolean
  isStored: boolean
  isChosen: boolean
  dateSetting: dateSettingType
  tesCase: selectOptionType[]
  tlm: requestTlmType[]
}

export type TlmDataType = string | number | null

export type TlmDataObjectType = {
  tlm: {
    [key: string]: {
      time: TlmDataType[]
      data: TlmDataType[]
    }
  }
  warningMessages: string[]
}

export type GraphDataType = {
  tlmName: string
  x: TlmDataType[]
  y: TlmDataType[]
}
export type GraphDataEachPlotIdType = {
  plotId: number
  tlm: GraphDataType[]
}
export type GraphDataArrayType = GraphDataEachPlotIdType[]

export type CsvDataType = {
  Time: TlmDataType
  [key: string]: TlmDataType
}
