import Header from "./components/Header.jsx";
import GameContainer from "./components/GameContainer.jsx";
import { useState, useEffect } from "react";

// Fisher-yates Shuffle logic to shuffle an array of beavers
function shuffleArray(beavers) {
  const shuffledBeavers = [...beavers];

  // Loop backwards through the array
  for (let i = shuffledBeavers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // Swap beavers at indices i and j
    const temp = shuffledBeavers[i];
    shuffledBeavers[i] = shuffledBeavers[j];
    shuffledBeavers[j] = temp;
  }
  return shuffledBeavers;
}

function App() {
  const [beavers, setBeavers] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [clickedBeavers, setClickedBeavers] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);

  useEffect(() => {
    async function fetchBeavers() {
      try {
        const response = await fetch("/api/MoreHttpApi/characters");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const adults = shuffleArray(data.Adult || []);
        const kits = shuffleArray(data.Child || []);
        const bots = shuffleArray(data.Bot || []);
        const totalAvailable = adults.length + kits.length + bots.length;

        // Easter Egg Trigger: Absolute colony wipeout condition
        if (totalAvailable === 0) {
          setEasterEggActive(true);
          setBeavers([]);
          return;
        }

        // Dynamically scale card maximum limit down if total alive is below 12
        const targetDeckSize = Math.min(12, totalAvailable);
        const selectedEntities = [];

        // Round-Robin Distribution loop
        while (selectedEntities.length < targetDeckSize) {
          if (adults.length > 0) selectedEntities.push(adults.shift());
          if (selectedEntities.length === targetDeckSize) break;

          if (kits.length > 0) selectedEntities.push(kits.shift());
          if (selectedEntities.length === targetDeckSize) break;

          if (bots.length > 0) selectedEntities.push(bots.shift());
        }

        // Transform raw data into clean objects.
        const cleanBeavers = selectedEntities.map((character) => ({
          id: character.Entity.EntityId,
          name: character.Name,
          image: character.ImagePath,
          age: character.Age,
        }));

        // Final random layout shuffle before saving to state
        setBeavers(shuffleArray(cleanBeavers));
        setEasterEggActive(false);
      } catch (error) {
        console.error("failed to fetch Timberborn characters:", error);
      }
    }

    fetchBeavers();
  }, []);

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

  function resetGame() {
    setCurrentScore(0);
    setClickedBeavers([]);
    setIsGameOver(false);
  }

  return (
    <div className="app-container-wrapper">
      <Header currentScore={currentScore} highScore={highScore} />
      {/* Conditional display: check if easter egg should overwrite game canvas */}
      {easterEggActive ? (
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
        />
      )}
    </div>
  );
}

export default App;
