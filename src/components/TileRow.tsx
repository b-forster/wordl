import { useEffect, useCallback, useState } from 'react';
import Tile from './Tile'
import { CharCounts, Letter } from '../types';
import { createCharCounts, processMatchAndGetTileColor } from '../utils/wordUtils';
import { useGameStore } from '../store/gameStore';

interface TileRowProps {
    word: Letter[];
    rowId: number;
    active: boolean;
}

const TileRow = ({ word, rowId, active }: TileRowProps) => {
    const { currentGuess, solution, addLetter, removeLetter, submitGuess } = useGameStore();

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

    // For editable row with a guess in progress
    if (active) {
        // Populate with empty tiles as needed to fill out row
        while (guessLetters.length < 5) {
            guessLetters.push(null)
        }

        return (
            guessLetters.map((letter, colId) => {
                return <Tile key={`${rowId}${colId}`}>{letter}</Tile>
            })
        )
    }

    // For non-editable rows without a guess in progress
    const remainingChars: CharCounts = createCharCounts(solution)
    return (
        word.map((letter, colId) => {
            return <Tile
                key={`${rowId}${colId}`}
                color={processMatchAndGetTileColor(solution, letter, colId, remainingChars)}
            >
                {letter}
            </Tile>
        })
    )
}

export default TileRow
