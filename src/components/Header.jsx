function Header(props) {
  const { currentScore, highScore } = props;

  return (
    <header>
      <div className="title-container">
        <h1>Timberborn Memory Game</h1>
        <p className="game-rules">
          Click on different beavers to earn points, but don't click the same beaver
          twice!
        </p>
      </div>

      <div className="scoreboard">
        <div className="score-box">
          <span>Current Score:</span>
          <span className="score-number">{currentScore}</span>
        </div>
        <div className="score-box">
          <span>High Score:</span>
          <span className="score-number">{highScore}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
