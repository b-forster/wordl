import { Box, SimpleGrid } from '@chakra-ui/react'
import TileRow from './TileRow'
import { useGameStore } from '../store/gameStore'
import { Toaster } from '@/components/ui/toaster'


const WordGrid = () => {
    const { grid, activeRow } = useGameStore()

    const isActiveRow = (rowIndex: number) => {
        return rowIndex === activeRow
    }

    return (
        <Box position="relative">
            {/* Toast container positioned relative to this Box */}
            <Box
                position="absolute"
                top="-2.5rem"
                left="50%"
                transform="translateX(-50%)"
                zIndex="toast"
                width="100%"
                maxWidth="sm"
                textAlign="center"
            >
                <Toaster />
            </Box>
            <SimpleGrid
                columns={5}
                gap='1.5'
            >
                {grid.map((row, rowId) => {
                    return <TileRow key={rowId} word={row} rowId={rowId} active={isActiveRow(rowId)} />
                })}

            </SimpleGrid >
        </Box>
    )
}

export default WordGrid
