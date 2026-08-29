import { createContext, use } from 'react'

export const PortalContainerContext = createContext<HTMLElement | null>(null)

export function usePortalContainer(): HTMLElement {
  const portalContainer = use(PortalContainerContext)

  if (!portalContainer) {
    throw new Error('UiProvider is required for portalled UI components.')
  }

  return portalContainer
}
