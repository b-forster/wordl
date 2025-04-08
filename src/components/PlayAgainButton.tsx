import { useGameStore } from '../store/gameStore'
import { Button } from '@chakra-ui/react'

const PlayAgainButton = () => {
    const { resetGame } = useGameStore()

    return (
        <Button
            rounded='full'
            variant='outline'
            w='60%'
            p={5}
            m={8}
            onClick={resetGame}
        >
            Play again
        </Button>
    )
}

export default PlayAgainButton