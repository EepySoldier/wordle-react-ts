import { useEffect, useRef, Dispatch } from "react";

import { fiveLetterWords } from './assets/five-letter-words.json'

export const useKeyPress = ((setKeyPressed: Dispatch<React.SetStateAction<{ key: string }>>) => {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === '\n' || event.key === '\r') {
                setKeyPressed({key: event.key.toUpperCase()})
            } else if (event.key === 'Backspace' || event.key === '\b') {
                setKeyPressed({key: event.key.toUpperCase()})
            } else if (/^[a-zA-Z]$/.test(event.key)) {
                setKeyPressed({key: event.key.toUpperCase()})
            }
        }

        window.addEventListener('keydown', handleKeyPress)

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [])
})

export const useRandomWord = () => {
    const rnd = Math.floor(Math.random() * fiveLetterWords.length)
    const word = fiveLetterWords[rnd]

    const rndWord = useRef(word)

    return rndWord.current
}
