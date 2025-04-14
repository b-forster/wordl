import { useGameStore } from '../store/gameStore'
import { Button } from '@chakra-ui/react'
import { useKeyPress } from '../hooks/useKeyPress'
import { memo } from 'react'

const PlayAgainButton = memo(() => {
    const { resetGame } = useGameStore()

    // Use the custom hook to handle Enter key press
    useKeyPress({
        key: 'Enter',
        onKeyPress: resetGame
    });

    return (
        <Button
            rounded='full'
            variant='outline'
            w='100%'
            p={5}
            m={5}
            onClick={resetGame}
        >
            Play again
        </Button>
    )
})

export default PlayAgainButton
