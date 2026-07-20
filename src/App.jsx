import Header from "./components/Header.jsx";
import GameContainer from "./components/GameContainer.jsx";
import { useState, useEffect } from "react";

// Fisher-yates Shuffle logic to shuffle an array of beavers
function shuffleArray(beavers) {
  const shuffledBeavers = [...beavers];

  // Loop backwards through the array
  for (let i = shuffledBeavers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // Swap beavers at indices i(current index) and j(random index)
    const temp = shuffledBeavers[i];
    shuffledBeavers[i] = shuffledBeavers[j];
    shuffledBeavers[j] = temp;
  }
  return shuffledBeavers;
}

// High score is saved to local storage so that is is persistent
function getSavedHighScore() {
  const savedScore = localStorage.getItem("timberborn_high_score");
  return savedScore ? parseInt(savedScore, 10) : 0;
}

function transformBeaverData(rawData) {
  if (!rawData) return { gameDeck: [], isExtinct: true };

  const adults = shuffleArray(rawData.Adult || []);
  const kits = shuffleArray(rawData.Child || []);
  const bots = shuffleArray(rawData.Bot || []);

  // Easter Egg Trigger: Absolute colony wipeout condition
  // (This catches rare edge case of the game state where there are 0 beavers alive,
  // but the colony is still recoverable)
  const totalAvailable = adults.length + kits.length + bots.length;
  if (totalAvailable === 0) {
    return { gameDeck: [], isExtinct: true };
  }

  // Round-Robin Distribution loop - ensure a variety of beavers
  // Maximum card limit is dynamically scaled down if total alive is below 12
  const targetDeckSize = Math.min(12, totalAvailable);
  const selectedEntities = [];
  while (selectedEntities.length < targetDeckSize) {
    if (adults.length > 0) selectedEntities.push(adults.shift());
    if (selectedEntities.length === targetDeckSize) break;

    if (kits.length > 0) selectedEntities.push(kits.shift());
    if (selectedEntities.length === targetDeckSize) break;

    if (bots.length > 0) selectedEntities.push(bots.shift());
  }

  // Transform raw data into clean objects.
  const gameDeck = selectedEntities.map((character) => ({
    id: character.Entity.EntityId,
    name: character.Name,
    image: character.ImagePath,
    age: character.Age,
  }));

  return {
    // Final random layout shuffle before returning the deck of beavers
    gameDeck: shuffleArray(gameDeck),
    isExtinct: false,
  };
}

function App() {
  const [beavers, setBeavers] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(getSavedHighScore);
  const [clickedBeavers, setClickedBeavers] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [errorActive, setErrorActive] = useState(false);

  async function fetchBeavers() {
    try {
      const response = await fetch("/api/MoreHttpApi/characters");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return transformBeaverData(data);
    } catch (error) {
      console.error("failed to fetch Timberborn characters:", error);
      setErrorActive(true);
      return { gameDeck: [], isExtinct: false };
    }
  }

  useEffect(() => {
    let isMounted = true;

    // Initialize the game
    (async function () {
      const result = await fetchBeavers();

      // because the data is retrieved asyncronously,
      // it is possible that the component is destroyed before getting a response.
      // So we check, and only then set the state if the component is still mounted.
      if (isMounted) {
        setEasterEggActive(result.isExtinct);
        setBeavers(result.gameDeck);
        setErrorActive(result.gameDeck.length === 0 && !result.isExtinct);
      }
    })();

    return () => {
      // Cleanup on component destruction,
      // prevents async function from trying to set state on dead component
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("timberborn_high_score", highScore.toString());
  }, [highScore]);

  function handleCardClick(cardId) {
    if (clickedBeavers.includes(cardId)) {
      if (currentScore > highScore) setHighScore(currentScore);
      setIsGameOver(true);
    } else {
      setClickedBeavers([...clickedBeavers, cardId]);

      const newScore = currentScore + 1;
      setCurrentScore(newScore);
      if (newScore > highScore) setHighScore(newScore);

      setBeavers(shuffleArray(beavers));
    }
  }

  async function resetGame() {
    setCurrentScore(0);
    setClickedBeavers([]);
    setIsGameOver(false);

    const result = await fetchBeavers();
    setEasterEggActive(result.isExtinct);
    setBeavers(result.gameDeck);
    if (result.gameDeck.length > 0) {
      setErrorActive(false);
    }
  }

  return (
    <div className="app-container-wrapper">
      <Header currentScore={currentScore} highScore={highScore} />
      {errorActive ? (
        <div className="api-error-panel">
          <h2>Cannot Connect to Timberborn API</h2>
          <p>
            The frontend application was unable to retrieve data from your game server.
          </p>
          <div className="troubleshooting-steps">
            <h3>Troubleshooting Local Setup:</h3>
            <ul>
              <li>Ensure Timberborn is running and your save file is active.</li>
              <li>
                Verify the MoreHttpApi mod is installed and enabled in your game client.
              </li>
              <li>
                Double-check that your Vite dev server proxy configuration matches your
                API port.
              </li>
            </ul>
          </div>
          <button onClick={resetGame} className="retry-btn">
            Retry Connection
          </button>
        </div>
      ) : easterEggActive ? (
        <div className="extinction-easter-egg">
          <h2>Zero Beavers detected in your colony! </h2>
          <p>I hope you remembered your emergency breeding pods...</p>
          <p>Life, uh, finds a way!</p>
        </div>
      ) : (
        <GameContainer
          beavers={beavers}
          clickedBeavers={clickedBeavers}
          onCardClick={handleCardClick}
          isGameOver={isGameOver}
          onReset={resetGame}
          currentScore={currentScore}
        />
      )}
    </div>
  );
}

export default App;
