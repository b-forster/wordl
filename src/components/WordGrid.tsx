import { useState } from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import TileRow from './TileRow'





const WordGrid = () => {
    const [grid, setGrid] = useState([
        ['A', 'P', 'P', 'L', 'P',],
        ['H', 'H', 'A', 'N', 'K',],
        [null, null, null, null, null,],
        [null, null, null, null, null,],
        [null, null, null, null, null,],
        [null, null, null, null, null,],
    ])

    // const [guess, setGuess] = useState(['H', null, null, null, null])
    // const [activeRow, setActiveRow] = useState(0);

    // const isActiveRow = (rowIndex: number) => {
    //     return rowIndex === activeRow
    // }

    return (
        <SimpleGrid
            columns={5}
            gap='2'
        >
            {grid.map((row, rowId) => {
                return <TileRow key={rowId} guess={row} rowId={rowId} />
            })}

        </SimpleGrid>
    )
}

export default WordGrid