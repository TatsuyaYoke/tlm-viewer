import type { MutableRefObject } from 'react'
import { useEffect } from 'react'

export const useResizeObserver = <T extends MutableRefObject<null>, U extends (...args: unknown[]) => unknown>(
  element: T,
  callback: U
) => {
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      callback(entries)
    })

    if (element.current) resizeObserver.observe(element.current)

    return () => resizeObserver.disconnect()
  }, [])
}
