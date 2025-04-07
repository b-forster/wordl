import { useState } from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import TileRow from './TileRow'
import { Letter } from '../types'


const WordGrid = () => {
    const [grid, setGrid] = useState<Letter[][]>([
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
    ])

    // const [guess, setGuess] = useState(['H', null, null, null, null])
    const [activeRow, setActiveRow] = useState(0);

    const isActiveRow = (rowIndex: number) => {
        return rowIndex === activeRow
    }

    return (
        <SimpleGrid
            columns={5}
            gap='1'
        >
            {grid.map((row, rowId) => {
                return <TileRow key={rowId} word={row} rowId={rowId} active={isActiveRow(rowId)} />
            })}

        </SimpleGrid>
    )
}

export default WordGrid
