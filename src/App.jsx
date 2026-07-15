import Header from "./components/Header.jsx";
import GameContainer from "./components/GameContainer.jsx";
import { useState, useEffect } from "react";

function App() {
  const [beavers, setBeavers] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [clickedBeavers, setClickedBeavers] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    async function fetchBeavers() {
      try {
        const response = await fetch("/api/MoreHttpApi/characters");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Combine the different beaver arrays from the API response
        const allEntities = [...data.Adult, ...data.Child, ...data.Bot];

        // Transform raw data into clean objects.
        const cleanBeavers = allEntities.map((character) => ({
          id: character.Entity.EntityId,
          name: character.Name,
          image: character.ImagePath,
          age: character.age,
        }));

        setBeavers(cleanBeavers);
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

      // Fisher-yates Shuffle logic to shuffle the beavers
      const shuffledBeavers = [...beavers];

      // Loop backwards through the array
      for (let i = shuffledBeavers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        // Swap beavers at indices i and j
        const temp = shuffledBeavers[i];
        shuffledBeavers[i] = shuffledBeavers[j];
        shuffledBeavers[j] = temp;
      }
      setBeavers(shuffledBeavers);
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
      <GameContainer
        beavers={beavers}
        clickedBeavers={clickedBeavers}
        onCardClick={handleCardClick}
        isGameOver={isGameOver}
        onReset={resetGame}
      />
    </div>
  );
}

export default App;
