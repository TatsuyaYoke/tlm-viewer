import * as z from 'zod'

import type { MultiValue } from 'chakra-react-select'

export type Main = {
  getData: (path: string, query: string) => Promise<apiReturnType<ObjectArrayTypeIncludingDate>>
  getSettings: () => apiReturnType<pjSettingWithTlmIdType[]>
  Maximize: () => void
  Minimize: () => void
  Close: () => void
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

export const pjSettingSchema = z.object({
  pjName: z.string().regex(/^DSX[0-9]{4}/),
  groundTestPath: z.string(),
  orbitDatasetPath: z.string().regex(/^syns-sol-grdsys-external-prod.strix_/),
})
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
