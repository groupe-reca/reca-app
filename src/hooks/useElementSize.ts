import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return { height }
}
