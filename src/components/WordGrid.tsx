import { useState } from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import TileRow from './TileRow'





const WordGrid = () => {
    const [grid, setGrid] = useState([
        [null, null, null, null, null],
        [null, null, null, null, null],
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
            gap='1'
        >
            {grid.map((row, rowId) => {
                return <TileRow key={rowId} guess={row} rowId={rowId} />
            })}

        </SimpleGrid>
    )
}

export default WordGrid