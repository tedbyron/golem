import { useState, useEffect } from 'react'

/**
 * Create a stateful value containing the client dimensions of `document.body`
 * by attaching a `resize` event listener to `window`.
 * @returns {{
 *   width: number,
 *   height: number
 * }}
 * A stateful object containing the client height and width of `body`.
 */
const useClientSize = () => {
  const [clientSize, setClientSize] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    const handleResize = () => {
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

  return clientSize
}

export default useClientSize
