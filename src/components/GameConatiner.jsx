import Card from "./Card.jsx";

function GameContainer(props) {
  const { beavers, onCardClick, isGameOver, onReset } = props;

  if (isGameOver) {
    return (
      <div className="game-over-overlay">
        <h2>Game Over!</h2>
        <button onClick={onReset}>Play Again</button>
      </div>
    );
  }

  return (
    <main className="game-grid">
      {beavers.map((beaverName) => {
        // prettier-ignore
        return (
          <Card
            key={beaverName}
            name={beaverName}
            onCardClick={onCardClick}
          />
        );
      })}
    </main>
  );
}

export default GameContainer;
