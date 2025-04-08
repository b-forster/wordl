import { useEffect, useCallback, useState } from 'react';
import Tile from './Tile'
import { Letter, LetterStatus, letterStatusColorMap } from '../types';
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

    const existsAtPosition = (letter: Letter, index: number) => {
        return answerChars[index] === letter
    }

    const existsInWord = (letter: Letter) => {
        return charCounts.get(letter) > 0
    }

    const decrementCharCount = (letter: Letter) => {
        charCounts.set(letter, (charCounts.get(letter) - 1))
    }

    const evaluateLetterStatus = (letter: Letter, index: number): LetterStatus => {
        if (!letter) return LetterStatus.UNKNOWN
        if (existsAtPosition(letter, index)) {
            return LetterStatus.CORRECT
        }
        if (existsInWord(letter)) {
            return LetterStatus.DIFF_POS
        };
        return LetterStatus.ABSENT
    }


    const determineTileColorFromStatus = (status: LetterStatus) => {
        return letterStatusColorMap[status]
    }

    const processMatchAndGetTileColor = (letter: Letter, index: number) => {
        const status: LetterStatus = evaluateLetterStatus(letter, index)
        // Keep track of number of matches in case of repeated letters
        // ex: for solution 'HAPPY', first two instances of 'P' in guess are yellow/green matches, third is not
        if (status === LetterStatus.CORRECT || LetterStatus.DIFF_POS) decrementCharCount(letter)
        return determineTileColorFromStatus(status)
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
                color={processMatchAndGetTileColor(word[colId], colId)}
            >
                {letter}
            </Tile>
        })
    )
}

export default TileRow
