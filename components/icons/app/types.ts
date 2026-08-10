import type { ImgHTMLAttributes } from 'react'

export type AppIconProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'src'
>
