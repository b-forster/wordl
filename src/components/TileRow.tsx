import { useEffect, useState } from 'react';
import Tile from './Tile'
import { Letter } from '../types';
import { evaluateGuess, determineTileColorFromStatus } from '../utils/wordUtils';
import { useGameStore } from '../store/gameStore';
import { useKeyPress } from '../hooks/useKeyPress';

interface TileRowProps {
    word: Letter[];
    rowId: number;
    active: boolean;
}

const TileRow = ({ word, rowId, active }: TileRowProps) => {
    const { currentGuess, solution, submitGuess, addLetter, removeLetter } = useGameStore();
    const [enterPressed, setEnterPressed] = useState(false);

    // Use the custom hook for letter keys (A-Z)
    useKeyPress({
        key: 'regex:/^[A-Za-z]$/',
        onKeyPress: (key) => {
            if (key) {
                addLetter(key);
            }
        },
        isActive: active
    });

    // Use the custom hook for Backspace key
    useKeyPress({
        key: 'Backspace',
        onKeyPress: removeLetter,
        isActive: active
    });

    // Use the custom hook for Enter key
    useKeyPress({
        key: 'Enter',
        onKeyPress: () => setEnterPressed(true),
        isActive: active
    });

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
    const letterStatuses = evaluateGuess(word, solution);

    return (
        word.map((letter, colId) => {
            return <Tile
                key={`${rowId}${colId}`}
                color={determineTileColorFromStatus(letterStatuses[colId])}
            >
                {letter}
            </Tile>
        })
    )
}

export default TileRow
