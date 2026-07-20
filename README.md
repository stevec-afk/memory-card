# Timberborn Beaver Memory Match

A simple memory-card game built with React, themed around the aesthetic of **[Timberborn](https://store.steampowered.com/app/1062090/Timberborn/)**. What is timberborn? Timberborn is an indie sandbox city-building video game featuring beavers! This app connects to Timberborn's locally running (modded) API to pull the names and images of beavers directly from the game.

---

## Important Project Limitation (No Live Preview)

⚠️ **Please Note:** Because this application relies on a real-time data connection to a locally running _Timberborn_ game instance, **there is no static live preview available for this project.**

To run this application, you must own a copy of _Timberborn_, install the required mods, and run both the game client and the web development server locally on your machine.

---

## Features

- **Persistent High Scores:** Your high score is saved using `localStorage`.
- **Timberborn API Connection:** Uses the live timberborn API to pull beavers directly from your active game.
- **Dynamic Shuffle:** Automatically ensures an equal split of Adults, Kits, and Bots based entirely on your live game's current demographics.
- **Micro-Colony Scaling:** Automatically adjusts the maximum deck size downward if your active save file has fewer than 12 total surviving beavers.
- **Robust Error handling:** Includes an emergency crimson Connection Error panel detailing active debugging solutions in the event of an API or port timeout.
- **Doomsday Easter Egg:** A custom messsage is displayed if a specific game state is detected where there are no beavers, but its not game over! (hint: you need to be playing the ironteeth faction for this to happen!)

---

## Local Setup & Installation Instructions

To spin this project up on your machine, follow these three sequential installation blocks:

### 1. Game Client & Mod Prerequisites

1. Ensure you have **Timberborn** installed on your machine via steam.
2. Install the [More HTTP API](https://steamcommunity.com/sharedfiles/filedetails/?id=3729176372) mod from the steam workshop and all its dependancies.

### 2. Initializing Your Save Game

1. Open the Timberborn client and either start a new game or load an active save game file.
2. Check that the mods are active and running, and note which port is configured (port `5171` is used by default).

### 3. Staging the Web Frontend

1. Clone this repository to your local computer.
2. Open your terminal inside the root project directory and install the required dependencies:
   ```bash
   npm install
   ```
3. Open `vite.config.js` and verify that the server proxy configuration block is pointing directly to your client port:
   ```javascript
   proxy: {
     '/api': 'http://localhost:5171'
   }
   ```
4. Fire up the Vite local web development server:
   ```bash
   npm run dev
   ```
5. Open your web browswer and go to the local vite server: `http://localhost:5173`.

---

## Technologies Used

- **HTML/CSS/JS**
- **React**
- **Vite**
- **Git**
