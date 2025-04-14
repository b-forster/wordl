import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { Button } from '@chakra-ui/react'

const PlayAgainButton = () => {
    const { resetGame } = useGameStore()

    // Add keyboard event listener for Enter key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                resetGame();
            }
        };

        // Add the event listener when component mounts
        document.addEventListener('keydown', handleKeyDown);

        // Clean up the event listener when component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [resetGame]);

    return (
        <Button
            rounded='full'
            variant='outline'
            w='80%'
            p={5}
            m={8}
            onClick={resetGame}
        >
            Play again
        </Button>
    )
}

export default PlayAgainButton
