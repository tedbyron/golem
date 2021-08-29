import { useState, useEffect } from 'react'

type ClientSize = () => {
  readonly width: number
  readonly height: number
}

const useClientSize = (): ClientSize => {
  const [clientSize, setClientSize] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    const handleResize = (): void => {
      setClientSize({
        width: document.body.clientWidth,
        height: document.body.clientHeight
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => (
      window.removeEventListener('resize', handleResize)
    )
  }, [])

  return clientSize as const
}

export default useClientSize
