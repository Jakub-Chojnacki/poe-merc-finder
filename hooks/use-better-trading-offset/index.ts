import { useEffect, useState } from 'react'
import {
  BETTER_TRADING_COLLAPSED_CLASS,
  BETTER_TRADING_CONTAINER_SELECTOR,
} from './const'

export function useBetterTradingOffset(): number {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let animationFrameId: number | undefined
    let observedContainer: Element | undefined
    let resizeObserver: ResizeObserver

    const measureOffset = (): void => {
      const container = document.querySelector(BETTER_TRADING_CONTAINER_SELECTOR)

      if (container !== observedContainer) {
        resizeObserver.disconnect()
        observedContainer = container ?? undefined

        if (observedContainer) {
          resizeObserver.observe(observedContainer)
        }
      }

      const isCollapsed = document.body.classList.contains(
        BETTER_TRADING_COLLAPSED_CLASS,
      )

      const nextOffset = container && !isCollapsed
        ? Math.round(container.getBoundingClientRect().width)
        : 0

      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId)
      }

      animationFrameId = window.requestAnimationFrame(() => {
        setOffset(nextOffset)
      })
    }

    resizeObserver = new ResizeObserver(measureOffset)

    const mutationObserver = new MutationObserver(measureOffset)

    mutationObserver.observe(document.body, {
      attributeFilter: ['class'],
      attributes: true,
      childList: true,
    })

    window.addEventListener('resize', measureOffset)
    measureOffset()

    return () => {
      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId)
      }

      mutationObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('resize', measureOffset)
    }
  }, [])

  return offset
}
