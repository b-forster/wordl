import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';
import { useGameStore } from '../src/store/gameStore';

// Mock dependencies
vi.mock('../src/store/gameStore', () => ({
    useGameStore: vi.fn()
}));

// Mock components
vi.mock('../src/components/Header', () => ({
    default: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('../src/components/WordGrid', () => ({
    default: () => <div data-testid="mock-word-grid">WordGrid</div>
}));

vi.mock('../src/components/Footer', () => ({
    default: () => <div data-testid="mock-footer">Footer</div>
}));

vi.mock('../src/components/Keyboard/Keyboard', () => ({
    default: () => <div data-testid="mock-keyboard">Keyboard</div>
}));

vi.mock('../src/components/PlayAgainButton', () => ({
    default: () => <div data-testid="mock-play-again-button">Play Again</div>
}));

describe('App', () => {
    // Mock game state and functions
    const mockLoadWordLists = vi.fn();
    const mockAddLetter = vi.fn();
    const mockSubmitGuess = vi.fn();
    const mockResetGame = vi.fn();

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Default mock implementation
        vi.mocked(useGameStore).mockReturnValue({
            isGameOver: false,
            loadWordLists: mockLoadWordLists,
            addLetter: mockAddLetter,
            submitGuess: mockSubmitGuess,
            resetGame: mockResetGame
        });
    });

    it('renders all main components', () => {
        render(<App />);

        // Check that all main components are rendered
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-word-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('renders the keyboard when game is not over', () => {
        // Set isGameOver to false
        vi.mocked(useGameStore).mockReturnValue({
            isGameOver: false,
            loadWordLists: vi.fn()
        });

        render(<App />);

        // Check that the keyboard is rendered
        expect(screen.getByTestId('mock-keyboard')).toBeInTheDocument();

        // Check that the play again button is not rendered
        expect(screen.queryByTestId('mock-play-again-button')).not.toBeInTheDocument();
    });

    it('renders the play again button when game is over', () => {
        // Set isGameOver to true
        vi.mocked(useGameStore).mockReturnValue({
            isGameOver: true,
            loadWordLists: vi.fn()
        });

        render(<App />);

        // Check that the play again button is rendered
        expect(screen.getByTestId('mock-play-again-button')).toBeInTheDocument();

        // Check that the keyboard is not rendered
        expect(screen.queryByTestId('mock-keyboard')).not.toBeInTheDocument();
    });

    it('calls loadWordLists on mount', () => {
        render(<App />);

        // Check that loadWordLists was called
        expect(mockLoadWordLists).toHaveBeenCalled();
    });

    it('renders the correct UI based on game state changes', () => {
        // Create a mock implementation that can change state
        let isGameOver = false;
        const mockUseGameStore = vi.fn(() => ({
            isGameOver,
            loadWordLists: mockLoadWordLists,
            addLetter: mockAddLetter,
            submitGuess: mockSubmitGuess,
            resetGame: () => {
                isGameOver = false;
                return mockResetGame();
            }
        }));

        vi.mocked(useGameStore).mockImplementation(mockUseGameStore);

        const { rerender } = render(<App />);

        // Initially, keyboard should be visible
        expect(screen.getByTestId('mock-keyboard')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-play-again-button')).not.toBeInTheDocument();

        // Change game state to over
        isGameOver = true;
        rerender(<App />);

        // Now play again button should be visible
        expect(screen.getByTestId('mock-play-again-button')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-keyboard')).not.toBeInTheDocument();
    });

    it('integrates with theme provider', () => {
        // This test verifies that the ChakraProvider is properly set up
        // We can't directly test the theme, but we can check that the provider is rendered
        const { container } = render(<App />);

        // ChakraProvider adds specific classes to the container
        expect(container.firstChild).toHaveAttribute('class', expect.stringContaining('chakra'));
    });
});
