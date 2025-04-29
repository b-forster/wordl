import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import PlayAgainButton from '../../src/components/PlayAgainButton';
import { useGameStore } from '../../src/store/gameStore';
import { useKeyPress } from '../../src/hooks/useKeyPress';
import theme from '../../src/theme';

// Mock dependencies
vi.mock('../../src/store/gameStore', () => ({
    useGameStore: vi.fn()
}));

vi.mock('../../src/hooks/useKeyPress', () => ({
    useKeyPress: vi.fn()
}));

describe('PlayAgainButton', () => {
    // Mock resetGame function
    const mockResetGame = vi.fn();

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Default mock implementation
        vi.mocked(useGameStore).mockReturnValue({
            resetGame: mockResetGame
        });
    });

    it('renders the button with correct text', () => {
        render(
            <ChakraProvider value={theme}>
                <PlayAgainButton />
            </ChakraProvider>
        );

        const button = screen.getByText('Play again');
        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
    });

    it('calls resetGame when clicked', () => {
        render(
            <ChakraProvider value={theme}>
                <PlayAgainButton />
            </ChakraProvider>
        );

        const button = screen.getByText('Play again');
        fireEvent.click(button);

        expect(mockResetGame).toHaveBeenCalledTimes(1);
    });

    it('sets up keyboard listener for Enter key', () => {
        render(
            <ChakraProvider value={theme}>
                <PlayAgainButton />
            </ChakraProvider>
        );

        // Check that useKeyPress was called with the correct parameters
        expect(useKeyPress).toHaveBeenCalledWith({
            key: 'Enter',
            onKeyPress: mockResetGame
        });
    });

    it('passes the resetGame function to useKeyPress', () => {
        render(
            <ChakraProvider value={theme}>
                <PlayAgainButton />
            </ChakraProvider>
        );

        // Get the onKeyPress function passed to useKeyPress
        const useKeyPressCall = vi.mocked(useKeyPress).mock.calls[0][0];
        const onKeyPressFunction = useKeyPressCall.onKeyPress;

        // Call the onKeyPress function
        onKeyPressFunction();

        // Check that resetGame was called
        expect(mockResetGame).toHaveBeenCalledTimes(1);
    });
});
