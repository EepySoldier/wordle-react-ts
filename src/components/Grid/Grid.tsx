import "./Grid.scss";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import Row from "../Row/Row.tsx";

import { fiveLetterWords } from "../../assets/five-letter-words.json";

type GridProps = {
  gridState: string[][];
  setGridState: Dispatch<SetStateAction<string[][]>>;
  keyPressed: { key: string };
  isGameOver: boolean;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
  wordToGuess: string;
  setIsErrorVisible: Dispatch<SetStateAction<boolean>>;
  setUsedLetters: Dispatch<SetStateAction<Record<string, string>>>;
  setGameOverText: Dispatch<SetStateAction<string>>;
};

export default function Grid({
  gridState,
  setGridState,
  keyPressed,
  isGameOver,
  setIsGameOver,
  wordToGuess,
  setIsErrorVisible,
  setUsedLetters,
  setGameOverText,
}: GridProps) {
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentCol, setCurrentCol] = useState<number>(0);

  const [cellStyles, setCellStyles] = useState<string[][]>(
    Array.from({ length: 6 }, () => Array(5).fill("")),
  );

  const errorTimeoutRef = useRef<number | null>(null);

  const updateUsedLetters = (letter: string, status: string) => {
    setUsedLetters((prevUsedLetters) => {
      if (prevUsedLetters[letter] === "green") {
        return prevUsedLetters;
      }
      return {
        ...prevUsedLetters,
        [letter]: status,
      };
    });
  };

  const evaluateRow = (
    rowIndex: number,
    updateUsedLetters: (letter: string, status: string) => void,
  ) => {
    if (!wordToGuess || wordToGuess.length !== 5) {
      console.error("Invalid wordToGuess:", wordToGuess);
      return Array(5).fill("gray");
    }

    const row = gridState[rowIndex];
    const styles: string[] = [];
    const remainingLetters = wordToGuess.toUpperCase().split("");

    row.forEach((cell, colIndex) => {
      if (cell.toUpperCase() === wordToGuess[colIndex].toUpperCase()) {
        styles[colIndex] = "green";
        remainingLetters[colIndex] = "";
        updateUsedLetters(cell.toUpperCase(), "green");
      } else {
        styles[colIndex] = "";
      }
    });

    row.forEach((cell, colIndex) => {
      if (styles[colIndex] !== "green") {
        if (remainingLetters.includes(cell.toUpperCase())) {
          styles[colIndex] = "yellow";
          remainingLetters[remainingLetters.indexOf(cell.toUpperCase())] = "";
          updateUsedLetters(cell.toUpperCase(), "yellow");
        } else {
          styles[colIndex] = "gray";
          updateUsedLetters(cell.toUpperCase(), "gray");
        }
      }
    });

    return styles;
  };

  useEffect(() => {
    const updateGridState = (row: number, col: number, value: string) => {
      const newGridState = gridState.map((rows: string[], rowIndex: number) => {
        return rows.map((cell: string, colIndex: number) => {
          if (rowIndex === row && colIndex === col) {
            return value;
          }
          return cell;
        });
      });
      setGridState(newGridState);
    };

    if (keyPressed.key.length === 1) {
      if (currentCol < 5 && gridState[currentRow][currentCol] === "") {
        const nextCol = Math.min(5, currentCol + 1);
        updateGridState(currentRow, currentCol, keyPressed.key.toUpperCase());
        setCurrentCol(nextCol);
      }
    } else if (keyPressed.key === "BACKSPACE" && !isGameOver) {
      const prevCol = Math.max(0, currentCol - 1);
      if (gridState[currentRow][prevCol] !== "") {
        updateGridState(currentRow, prevCol, "");
      }
      setCurrentCol(prevCol);
    } else if (keyPressed.key === "ENTER" && currentCol === 5 && !isGameOver) {
      const userWord = gridState[currentRow].join("").toLowerCase();

      if (!fiveLetterWords.includes(userWord)) {
        setIsErrorVisible(true);

        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }

        errorTimeoutRef.current = setTimeout(() => {
          setIsErrorVisible(false);
          errorTimeoutRef.current = null;
        }, 3000);

        return;
      }

      const currentRowStyles = evaluateRow(currentRow, updateUsedLetters);

      currentRowStyles.forEach((style, index) => {
        setTimeout(() => {
          const newCellStyles = [...cellStyles];
          newCellStyles[currentRow][index] = `flip`;
          setCellStyles(newCellStyles);
        }, index * 150);
        setTimeout(
          () => {
            const newCellStyles = [...cellStyles];
            newCellStyles[currentRow][index] = `${style} flip`;
            setCellStyles(newCellStyles);
          },
          index * 150 + 300,
        );
      });

      setTimeout(
        () => {
          if (gridState[currentRow].join("") === wordToGuess.toUpperCase()) {
            setGameOverText("Congratulations! You won!");
            setIsGameOver(true);
          } else if (currentRow === 5) {
            setGameOverText(
              "Sorry, you lost. The word was " +
                wordToGuess.toUpperCase() +
                ".",
            );
            setIsGameOver(true);
          } else {
            setCurrentRow(currentRow + 1);
            setCurrentCol(0);
          }
        },
        currentRowStyles.length * 150 + 600,
      );
    }
  }, [keyPressed]);

  return (
    <div className="grid">
      {gridState.map((row: string[], rowIndex: number) => (
        <Row
          key={rowIndex}
          row={row as [string, string, string, string, string]}
          styles={cellStyles[rowIndex]}
        />
      ))}
    </div>
  );
}
