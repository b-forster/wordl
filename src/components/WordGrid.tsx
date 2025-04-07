import { useState } from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import TileRow from './TileRow'
import { Letter } from '../types'

interface WordGridProps {
    onGameOver: () => void;
}

const WordGrid = ({ onGameOver }: WordGridProps) => {
    const [grid, setGrid] = useState<Letter[][]>([
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
    ])

    const [activeRow, setActiveRow] = useState(0);

    const isActiveRow = (rowIndex: number) => {
        return rowIndex === activeRow
    }

    const submitGuess = (guess: Letter[]) => {
        if (guess.length < 5) {
            console.log('Not enough letters');
            return;
        }

        // Create a new grid with the current guess in the active row
        const newGrid = [...grid];
        newGrid[activeRow] = [...guess];
        setGrid(newGrid);

        // Check win condition
        if (guess.join('') === 'HAPPY') {
            setActiveRow(Infinity)
            onGameOver()
            return;
        }

        // Move to the next row
        setActiveRow(activeRow + 1);
        if (activeRow < grid.length - 1) {
            setActiveRow(activeRow + 1)
        } else {
            onGameOver()
        }
    }

    return (
        <SimpleGrid
            columns={5}
            gap='1'
        >
            {grid.map((row, rowId) => {
                return <TileRow key={rowId} word={row} rowId={rowId} active={isActiveRow(rowId)} onSubmit={submitGuess} />
            })}

        </SimpleGrid>
    )
}

export default WordGrid
