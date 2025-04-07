import Tile from './Tile'

interface TileRowProps {
    guess: string[] | null[];
    rowId: number;
}

const TileRow = ({ guess, rowId }: TileRowProps) => {
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

    return (
        guess.map((letter, colId) => {
            return <Tile
                key={`${rowId}${colId}`}
                color={getTileColor(guess[colId], colId)}
            >
                {letter}
            </Tile>
        })
    )
}

export default TileRow