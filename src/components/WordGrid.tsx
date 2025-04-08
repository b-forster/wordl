import { SimpleGrid } from '@chakra-ui/react'
import TileRow from './TileRow'
import { useGameStore } from '../store/gameStore'
import { Toaster } from '@/components/ui/toaster'


const WordGrid = () => {
    const { grid, activeRow } = useGameStore()

    const isActiveRow = (rowIndex: number) => {
        return rowIndex === activeRow
    }

    return (
        <>
            <Toaster />
            <SimpleGrid
                columns={5}
                gap='1.5'
            >
                {grid.map((row, rowId) => {
                    return <TileRow key={rowId} word={row} rowId={rowId} active={isActiveRow(rowId)} />
                })}

            </SimpleGrid >
        </>
    )
}

export default WordGrid
