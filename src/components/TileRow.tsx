import { useEffect, useState } from 'react';
import Tile from './Tile'

interface TileRowProps {
    word: string[] | null[];
    rowId: number;
    active: boolean;
}

const TileRow = ({ word, rowId, active }: TileRowProps) => {
    const [guess, setGuess] = useState<string[]>([])

    let answer = 'Happy'
    let answerChars = answer.toUpperCase().split('');
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
    const getTileColor = (letter: string | null, index: number) => {
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

    if (active) {
        const handleKeyDown = (e: KeyboardEvent) => {
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
        }

        useEffect(() => {
            document.addEventListener("keydown", handleKeyDown);

            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            }
        }, [active]);

        let guessLetters: (string | null)[] = [...guess]
        console.log("guessLetters:", guessLetters)
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
