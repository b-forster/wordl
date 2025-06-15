import { useRef, useCallback } from "react";
import { useGameStore } from "../../store/gameStore";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import './styles.css'


const KeyBoard = () => {
    const keyboard = useRef('');
    const { addLetter, removeLetter, submitGuess, isGameOver, correctLetters, diffPosLetters, wrongLetters } = useGameStore();
    const layout = {
        'default': [
            'Q W E R T Y U I O P',
            'A S D F G H J K L',
            '{enter} Z X C V B N M {bksp}',
        ]
    }
    const display = {
        '{bksp}': '⌫',
        '{enter}': 'ENTER',
    }

    const onKeyReleased = useCallback((button: string) => {
        // Don't process keyboard events if the game is over
        if (isGameOver) return;

        if (button === '{bksp}') {
            removeLetter();
        }
        else if (button === '{enter}') {
            submitGuess();
        }
        else {
            // For regular letter keys
            addLetter(button);
        }
    }, [addLetter, removeLetter, submitGuess, isGameOver]);

    const getButtonTheme = () => {
        const buttonTheme = [
            {
                class: "key-green",
                buttons: [...correctLetters].join(' '),
            },
            {
                class: "key-yellow",
                buttons: [...diffPosLetters].join(' '),
            },
            {
                class: "key-gray",
                buttons: [...wrongLetters].join(' '),
            },
        ];

        // Filter out themes with empty button strings to avoid React warnings
        return buttonTheme.filter(theme => theme.buttons.trim() !== '');
    }

    return (
        <>
            <Keyboard
                keyboardRef={r => (keyboard.current = r)}
                layout={layout}
                layoutName={'default'}
                display={display}
                buttonTheme={getButtonTheme()}
                onKeyReleased={onKeyReleased}
            />
        </>
    )
}

export default KeyBoard
