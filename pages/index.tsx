import { useEffect, useState } from 'react'

import type { NextPage } from 'next'
import type { Automaton } from '@tedbyron/ca'

import Layout from '../components/layout'
import useClientSize from '../hooks/useClientSize'

const MAX_WIDTH = 1200
const MAX_HEIGHT = 400

const calcRows = (cellSize: number): number => (
  Math.floor((MAX_HEIGHT - 4) / cellSize)
)

const calcCols = (cellSize: number, clientWidth: number): number => {
  return Math.min(
    MAX_WIDTH / cellSize,
    Math.floor((clientWidth - 4) / cellSize)
  )
}

const IndexPage = (): NextPage => {
  const [automaton] = useState(async () => {
    await import('@tedbyron/ca/ca_bg.wasm')
      .then(({ a: Automaton }) => new a())
  })

  // set colors for first 25 cell states
  const [colors, setColors] = useState(() => {
    const colors = [0x212121, 0xffd600]
    for (let i = 0; i < 25; i += 1) {
      colors.push(
        parseInt(
          Math.floor(Math.random() * 16777215).toString(16),
          16
        )
      )
    }
    return colors
  })

  const [cellSize, setCellSize] = useState(5)
  const [rows, setRows] = useState(() => calcRows(cellSize))
  const clientSize = useClientSize()
  const [cols, setCols] = useState(() => calcCols(cellSize, clientSize.width))

  // recalculate rows and cols based on clientSize and cellSize
  useEffect(() => {
    setRows(calcRows(cellSize))
    setCols(calcCols(cellSize, clientSize.width))
  }, [clientSize, cellSize])

  return (
    <Layout>
      <section>
        <div className='golem-heading-wrapper'>
          <h1 className='golem-heading'>Golem</h1>
        </div>

        <div className='golem-options'>
          <p>hello idiot</p>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
