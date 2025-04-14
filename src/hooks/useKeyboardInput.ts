import { useCallback, useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface UseKeyboardInputProps {
    active: boolean;
}

interface UseKeyboardInputReturn {
    enterPressed: boolean;
    setEnterPressed: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Custom hook to handle keyboard input for the Wordle game
 * 
 * @param active Whether the component using this hook is active and should process keyboard events
 * @returns Object containing enterPressed state and setter
 */
export const useKeyboardInput = ({ active }: UseKeyboardInputProps): UseKeyboardInputReturn => {
    const { addLetter, removeLetter } = useGameStore();
    const [enterPressed, setEnterPressed] = useState(false);

    // Handle keyboard events
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Only process keyboard events if the component is active
        if (!active) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (e.key === 'Backspace') {
            removeLetter();
        }
        else if (/^[A-Za-z]$/.test(e.key)) {
            addLetter(e.key);
        }
        else if (e.key === 'Enter') {
            setEnterPressed(true);
        }
    }, [active, addLetter, removeLetter, setEnterPressed]);

    // Add and remove event listeners
    useEffect(() => {
        if (active) {
            document.addEventListener("keydown", handleKeyDown);

            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            }
        }
    }, [active, handleKeyDown]);

    return {
        enterPressed,
        setEnterPressed
    };
};
