import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KeyBoard from '../../src/components/Keyboard/Keyboard';
import { useGameStore } from '../../src/store/gameStore';

// Mock dependencies
vi.mock('../../src/store/gameStore', () => ({
    useGameStore: vi.fn()
}));

// Mock react-simple-keyboard
vi.mock('react-simple-keyboard', () => {
    const KeyboardMock = vi.fn(props => (
        <div data-testid="mock-keyboard">
            <div data-testid="keyboard-props" data-props={JSON.stringify({
                layout: props.layout,
                display: props.display,
                buttonTheme: props.buttonTheme,
            })}></div>
            <button
                data-testid="key-a"
                onClick={() => props.onKeyReleased('A')}
            >
                A
            </button>
            <button
                data-testid="key-enter"
                onClick={() => props.onKeyReleased('{enter}')}
            >
                ENTER
            </button>
            <button
                data-testid="key-backspace"
                onClick={() => props.onKeyReleased('{bksp}')}
            >
                ⌫
            </button>
        </div>
    ));
    return { default: KeyboardMock };
});

describe('Keyboard', () => {
    // Default game store values
    const mockGameStore = {
        addLetter: vi.fn(),
        removeLetter: vi.fn(),
        submitGuess: vi.fn(),
        isGameOver: false,
        correctLetters: new Set(['A', 'E']),
        diffPosLetters: new Set(['R', 'S']),
        wrongLetters: new Set(['Z', 'X'])
    };

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Default mock implementation
        vi.mocked(useGameStore).mockReturnValue(mockGameStore);
    });

    it('renders the keyboard component', () => {
        render(<KeyBoard />);

        expect(screen.getByTestId('mock-keyboard')).toBeInTheDocument();
    });

    it('passes correct layout and display props', () => {
        render(<KeyBoard />);

        const propsElement = screen.getByTestId('keyboard-props');
        const props = JSON.parse(propsElement.getAttribute('data-props') || '{}');

        // Check layout
        expect(props.layout).toEqual({
            'default': [
                'Q W E R T Y U I O P',
                'A S D F G H J K L',
                '{enter} Z X C V B N M {bksp}',
            ]
        });

        // Check display
        expect(props.display).toEqual({
            '{bksp}': '⌫',
            '{enter}': 'ENTER',
        });
    });

    it('passes correct button theme based on letter statuses', () => {
        render(<KeyBoard />);

        const propsElement = screen.getByTestId('keyboard-props');
        const props = JSON.parse(propsElement.getAttribute('data-props') || '{}');

        // Check button themes
        expect(props.buttonTheme).toEqual([
            {
                class: "key-green",
                buttons: "A E",
            },
            {
                class: "key-yellow",
                buttons: "R S",
            },
            {
                class: "key-gray",
                buttons: "Z X",
            },
        ]);
    });

    it('calls addLetter when a letter key is pressed', () => {
        render(<KeyBoard />);

        // Click the A key
        screen.getByTestId('key-a').click();

        // Check that addLetter was called with the correct argument
        expect(mockGameStore.addLetter).toHaveBeenCalledWith('A');
    });

    it('calls submitGuess when the enter key is pressed', () => {
        render(<KeyBoard />);

        // Click the enter key
        screen.getByTestId('key-enter').click();

        // Check that submitGuess was called
        expect(mockGameStore.submitGuess).toHaveBeenCalled();
    });

    it('calls removeLetter when the backspace key is pressed', () => {
        render(<KeyBoard />);

        // Click the backspace key
        screen.getByTestId('key-backspace').click();

        // Check that removeLetter was called
        expect(mockGameStore.removeLetter).toHaveBeenCalled();
    });

    it('does not process key presses when the game is over', () => {
        // Set isGameOver to true
        vi.mocked(useGameStore).mockReturnValue({
            ...mockGameStore,
            isGameOver: true
        });

        render(<KeyBoard />);

        // Click keys
        screen.getByTestId('key-a').click();
        screen.getByTestId('key-enter').click();
        screen.getByTestId('key-backspace').click();

        // Check that no functions were called
        expect(mockGameStore.addLetter).not.toHaveBeenCalled();
        expect(mockGameStore.submitGuess).not.toHaveBeenCalled();
        expect(mockGameStore.removeLetter).not.toHaveBeenCalled();
    });
});
