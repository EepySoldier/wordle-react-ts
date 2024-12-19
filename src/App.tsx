import "./App.scss";

import { useState, MouseEventHandler } from "react";

import Grid from "./components/Grid/Grid";
import Keyboard from "./components/Keyboard/Keyboard";
import GameOverModal from "./components/GameOverModal/GameOverModal";

import { useKeyPress, useRandomWord } from "./CustomHooks.ts";

export default function App() {
  const [gridState, setGridState] = useState<string[][]>(
    Array.from({ length: 6 }, () => Array(5).fill("")),
  );
  const [keyPressed, setKeyPressed] = useState<{ key: string }>({ key: "" });
  const [isGameOver, setIsGameOver] = useState(false);
  const wordToGuess = useRandomWord();
  const [usedLetters, setUsedLetters] = useState<Record<string, string>>({});
  const [buttonText, setButtonText] = useState<string>(
    "Reveal Word for testing",
  );
  const [gameOverText, setGameOverText] = useState<string>("Game Over!");

  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  useKeyPress(setKeyPressed);

  const showWord: MouseEventHandler<HTMLButtonElement> = (event) => {
    setButtonText(wordToGuess);
    event.currentTarget.blur();
  };

  return (
    <div className="container">
      <h1>Wordle</h1>
      <button className="reveal-btn" onClick={showWord}>
        {buttonText}
      </button>
      <Grid
        gridState={gridState}
        setGridState={setGridState}
        keyPressed={keyPressed}
        isGameOver={isGameOver}
        setIsGameOver={setIsGameOver}
        wordToGuess={wordToGuess}
        setIsErrorVisible={setIsErrorVisible}
        setUsedLetters={setUsedLetters}
        setGameOverText={setGameOverText}
      />
      <div className="error-box">
        {isErrorVisible && <h3>Are you sure this word exists?</h3>}
      </div>
      <GameOverModal
        show={isGameOver}
        onRestart={() => window.location.reload()}
        gameOverText={gameOverText}
      />
      <Keyboard setKeyPressed={setKeyPressed} usedLetters={usedLetters} />
    </div>
  );
}
