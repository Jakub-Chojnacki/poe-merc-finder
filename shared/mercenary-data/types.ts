import type { PublicPath } from 'wxt/browser'

export type SkillCategory = 'primary' | 'secondary' | 'utility'

export interface MercenaryOption {
  attribute: string
  iconPath: PublicPath
  house: string
  name: string
}

export interface MercenarySkillOption {
  name: string
  label: string
}
