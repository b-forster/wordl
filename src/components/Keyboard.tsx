import { useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import './styles.css'


const KeyBoard = () => {
    const keyboard = useRef('');
    const layout = {
        'default': [
            'Q W E R T Y U I O P',
            'A S D F G H J K L',
            '{enter} Z X C V B N M {bksp}',
        ]
    }
    const display = {
        '{bksp}': '⬅︎',
        '{enter}': 'ENTER',
    }
    // const buttonTheme = [
    //     {
    //         class: "hg-red",
    //         // buttons: "Q W E R T Y q w e r t y"
    //     },
    //     {
    //         // class: "hg-highlight",
    //         // buttons: "Q q"
    //     }
    // ]

    const onKeyPress = (button: string) => {
        console.log("Button pressed", button);
    };

    return (
        <>
            <Keyboard
                keyboardRef={r => (keyboard.current = r)}
                layout={layout}
                layoutName={'default'}
                display={display}
                // buttonTheme={buttonTheme}
                // theme={'keyboard'}
                // onChange={onChange}
                onKeyPress={onKeyPress}
            />
        </>
    )
}

export default KeyBoard