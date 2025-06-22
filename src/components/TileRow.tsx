import { useEffect, useState, memo } from 'react';
import Tile from './Tile'
import { Letter } from '../types';
import { evaluateGuess, determineTileColorFromStatus } from '../utils/wordUtils';
import { useGameStore } from '../store/gameStore';
import { useKeyPress } from '../hooks/useKeyPress';

interface TileRowProps {
    word: Letter[];
    rowId: number;
    isActive: boolean;
}

// Custom equality function for TileRow
const areEqual = (prevProps: TileRowProps, nextProps: TileRowProps) => {
    // Only re-render if the word, rowId, or active state has changed
    return (
        prevProps.isActive === nextProps.isActive &&
        prevProps.rowId === nextProps.rowId &&
        prevProps.word.length === nextProps.word.length &&
        prevProps.word.every((letter, index) => letter === nextProps.word[index])
    );
};

const TileRow = memo(({ word, rowId, isActive }: TileRowProps) => {
    const { currentGuess, solution, submitGuess, addLetter, removeLetter } = useGameStore();
    const [enterPressed, setEnterPressed] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);
    const [wasActive, setWasActive] = useState(isActive);

    // Use the custom hook for letter keys (A-Z)
    useKeyPress({
        key: 'regex:/^[A-Za-z]$/',
        onKeyPress: (key) => {
            if (key) {
                addLetter(key);
            }
        },
        isActive,
    });

    // Use the custom hook for Backspace key
    useKeyPress({
        key: 'Backspace',
        onKeyPress: removeLetter,
        isActive,
    });

    // Use the custom hook for Enter key
    useKeyPress({
        key: 'Enter',
        onKeyPress: () => setEnterPressed(true),
        isActive,
    });

    // Submit guess when Enter is pressed
    useEffect(() => {
        if (enterPressed && isActive) {
            submitGuess();
            setEnterPressed(false);
        }
    }, [enterPressed, submitGuess, isActive]);

    // Detect when a row transitions from active to inactive (guess submitted)
    useEffect(() => {
        if (wasActive && !isActive && word.length === 5) {
            // Row has just been submitted - start the reveal animation
            setIsRevealing(true);
        }
        setWasActive(isActive);
    }, [isActive, wasActive, word]);

    // Render either current in progress guess if row is active,
    // or previously submitted guess if not active
    const guessLetters: Letter[] = isActive ? [...currentGuess] : [...word];

    // For editable row with an unrevealed guess in progress,
    // populate with empty tiles as needed to fill out row
    if (isActive) {
        while (guessLetters.length < 5) {
            guessLetters.push(null)
        }
    }

    // No need to determine letter statuses for row with a guess in progress
    const letterStatuses = isActive ? [] : evaluateGuess(word, solution);

    return (
        guessLetters.map((letter, colId) => {
            return <Tile
                key={`${rowId}${colId}`}
                color={isActive ? undefined : determineTileColorFromStatus(letterStatuses[colId])}
                isRevealing={isRevealing}
            >
                {letter}
            </Tile>
        })
    )
})

export default memo(TileRow, areEqual)
