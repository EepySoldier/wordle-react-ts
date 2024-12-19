import "./GameOverModal.scss";

type GameOverModalProps = {
  show: boolean;
  onRestart: () => void;
  gameOverText: string;
};

export default function GameOverModal({
  show,
  onRestart,
  gameOverText,
}: GameOverModalProps) {
  return (
    <div className={`game-over-modal ${show ? "slide-in" : "hidden"}`}>
      <div className="game-over-content">
        <h1>{gameOverText}</h1>
        <button onClick={onRestart} className="restart-button">
          Restart
        </button>
      </div>
    </div>
  );
}
