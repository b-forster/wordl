import { useEffect, useCallback, useState } from 'react';
import Tile from './Tile'
import { Letter } from '../types';
import { useGameStore } from '../store/gameStore';

interface TileRowProps {
    word: Letter[];
    rowId: number;
    active: boolean;
}

const TileRow = ({ word, rowId, active }: TileRowProps) => {
    const { submitGuess, solution, currentGuess, addLetter, removeLetter } = useGameStore();

    // Use the solution from the store
    const answerChars = solution.split('');
    const charCounts = new Map()

    for (const char of answerChars) {
        charCounts.set(char, (charCounts.get(char) || 0) + 1)
    }

    const existsAtPosition = (letter: string, index: number) => {
        return answerChars[index] === letter
    }

    const existsInWord = (letter: string) => {
        return charCounts.get(letter) > 0
    }

    const decrementCharCount = (letter: string) => {
        charCounts.set(letter, (charCounts.get(letter) - 1))
    }

    // TODO: Rename function if we keep decrement side effect here
    const getTileColor = (letter: Letter, index: number) => {
        if (!letter) return;
        if (existsAtPosition(letter, index)) {
            decrementCharCount(letter)
            return 'green'
        };
        if (existsInWord(letter)) {
            decrementCharCount(letter)
            return 'yellow'
        };
        return 'gray';
    }

    // Track if Enter key was pressed
    const [enterPressed, setEnterPressed] = useState(false);

    // Use useCallback to memoize the handleKeyDown function
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Only process keyboard events if the row is active
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

    // Handle keyboard events
    useEffect(() => {
        if (active) {
            document.addEventListener("keydown", handleKeyDown);

            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            }
        }
    }, [active, handleKeyDown]);

    // Submit guess when Enter is pressed
    useEffect(() => {
        if (enterPressed && active) {
            submitGuess();
            setEnterPressed(false);
        }
    }, [enterPressed, submitGuess, active]);

    // Render either current in progress guess if row is active,
    // or previously submitted guess if not active
    const guessLetters: Letter[] = active ? [...currentGuess] : [...word];

    // If active row, fill remaining slots with null
    if (active) {
        while (guessLetters.length < 5) {
            guessLetters.push(null)
        }

        return (
            guessLetters.map((letter, colId) => {
                return <Tile key={`${rowId}${colId}`}>{letter}</Tile>
            })
        )
    }

    return (
        word.map((letter, colId) => {
            return <Tile
                key={`${rowId}${colId}`}
                color={getTileColor(word[colId], colId)}
            >
                {letter}
            </Tile>
        })
    )
}

export default TileRow
