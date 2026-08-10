import type { SVGProps } from 'react'

export type SvgIconProps = Omit<
  SVGProps<SVGSVGElement>,
  'children' | 'viewBox'
>
