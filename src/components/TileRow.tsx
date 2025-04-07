import { useEffect, useState, useCallback } from 'react';
import Tile from './Tile'
import { Letter } from '../types';
import { useGameStore } from '../store/gameStore';

interface TileRowProps {
    word: Letter[];
    rowId: number;
    active: boolean;
}

const TileRow = ({ word, rowId, active }: TileRowProps) => {
    const { submitGuess, solution } = useGameStore();
    const [guess, setGuess] = useState<Letter[]>([])

    // Use the solution from the store
    let answerChars = solution.split('');
    let charCounts = new Map()

    for (let char of answerChars) {
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

        if (e.key === 'Backspace') {
            setGuess(prev => prev.slice(0, -1))
        }
        else if (/^[A-Za-z]$/.test(e.key)) {
            setGuess(prev => {
                // Only add the letter if we have less than 5 letters
                if (prev.length < 5) {
                    return [...prev, e.key.toUpperCase()]
                }
                return prev
            })
        }
        else if (e.key === 'Enter') {
            setEnterPressed(true);
        }
    }, [active, setGuess, setEnterPressed]);

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
            submitGuess(guess);
            setEnterPressed(false);
        }
    }, [enterPressed, guess, submitGuess, active]);

    // Reset guess when the row becomes active (e.g., after game reset)
    useEffect(() => {
        if (active) {
            setGuess([]);
        }
    }, [active]);

    // Render either current in progress guess if row is active,
    // or previously submitted guess if not active
    let guessLetters: Letter[] = active ? [...guess] : [...word];

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
