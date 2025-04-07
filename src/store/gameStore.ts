import { create } from 'zustand'
import { Letter } from '../types'

interface GameState {
    grid: Letter[][]
    activeRow: number
    isGameOver: boolean

    submitGuess: (guess: Letter[]) => void
    resetGame: () => void
}

// Initial empty grid
const createEmptyGrid = (): Letter[][] => [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
]

export const useGameStore = create<GameState>((set, get) => ({
    // Initial state
    grid: createEmptyGrid(),
    activeRow: 0,
    isGameOver: false,

    // Submit guess
    submitGuess: (guess: Letter[]) => {
        const { grid, activeRow } = get()

        if (guess.length < 5) {
            console.log('Not enough letters')
            return
        }

        // Create a new grid with the current guess in the active row
        const newGrid = [...grid]
        newGrid[activeRow] = [...guess]

        // Check win condition
        if (guess.join('') === 'HAPPY') {
            set({
                grid: newGrid,
                activeRow: Infinity,
                isGameOver: true
            })
            return
        }

        // Move to the next row
        set({
            grid: newGrid,
            activeRow: activeRow + 1
        })


        // End the game if there are no more rows
        if (activeRow >= grid.length - 1) {
            set({
                grid: newGrid,
                isGameOver: true
            })
            return
        }
    },

    // Reset game
    resetGame: () => {
        set({
            grid: createEmptyGrid(),
            activeRow: 0,
            isGameOver: false
        })
    }
}))
