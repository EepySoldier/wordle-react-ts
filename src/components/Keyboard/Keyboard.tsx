import "./Keyboard.scss";
import React, { Dispatch, SetStateAction } from "react";

type KeyboardProps = {
  setKeyPressed: Dispatch<SetStateAction<{ key: string }>>;
  usedLetters: Record<string, string>;
};

export default function Keyboard({
  setKeyPressed,
  usedLetters,
}: KeyboardProps) {
  const rows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["⏎", ..."ZXCVBNM".split(""), "⌫"],
  ];

  const handleClick = (
    key: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setKeyPressed({ key: key });
    event.currentTarget.blur();
  };

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, keyIndex) => {
            const keyStatus = usedLetters[key] || "";
            const keyClass = `keyboard-key ${
              keyStatus ? `keyboard-key ${keyStatus}` : ""
            } ${key === "⏎" || key === "⌫" ? "keyboard-special" : ""}`;
            return (
              <button
                onClick={(event) => handleClick(key, event)}
                key={keyIndex}
                className={keyClass}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
