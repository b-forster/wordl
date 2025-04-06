import { SimpleGrid } from '@chakra-ui/react'
import Tile from './Tile'

let grid = [
    [null, null, null, null, null,],
    [null, null, null, null, null,],
    [null, null, null, null, null,],
    [null, null, null, null, null,],
    [null, null, null, null, null,],
    [null, null, null, null, null,],
]

const WordGrid = () => {
    return (
        <SimpleGrid
            columns={5}
            gap='2'
        >
            {grid.map((row, rowIndex) => {
                return row.map((tile, colIndex) => {
                    return <Tile key={`${rowIndex}-${colIndex}`}>{tile}</Tile>
                })
            })}

        </SimpleGrid>
    )
}

export default WordGrid