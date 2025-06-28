import { Box, SimpleGrid } from '@chakra-ui/react'
import TileRow from './TileRow'
import { useGameStore } from '../store/gameStore'
import { Toaster } from '@/components/ui/toaster'
import { evaluateGuess } from '../utils/wordUtils'


const WordGrid = () => {
    const { grid, activeRow, currentGuess, solution } = useGameStore()

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
                css={{
                    "@media (600px < width < 960px)": {
                        margin: "5vh 0 8vh",

                    }
                }}
            >
                {grid.map((word, rowId) => {
                    const isActive = isActiveRow(rowId);
                    return (
                        <TileRow
                            key={`row${rowId}`}
                            word={word}
                            rowId={rowId}
                            isActive={isActive}
                            currentGuess={isActive ? currentGuess : []}
                            letterStatuses={isActive ? [] : evaluateGuess(word, solution)}
                        />
                    );
                })}

            </SimpleGrid >
        </Box>
    )
}

export default WordGrid
