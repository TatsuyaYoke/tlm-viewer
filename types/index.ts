import type { MultiValue } from 'chakra-react-select'
import * as z from 'zod'

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
export const dateArraySchema = z.array(z.string())

export type ArrayObjectType = z.infer<typeof arrayObjectSchema>
export type ObjectType = z.infer<typeof objectTypeSchema>
export type DataType = z.infer<typeof dataTypeSchema>
export type ObjectArrayType = z.infer<typeof objectArrayTypeSchema>
export type ObjectArrayTypeIncludingDate = z.infer<typeof objectArrayTypeIncludeDateSchema>
export type DateArrayType = z.infer<typeof dateArraySchema>
