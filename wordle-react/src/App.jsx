import { useCallback, useEffect, useMemo, useState } from "react";

import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import GameModal from "./components/GameModal";

const WORDS = [
  "CRANE",
  "PLANT",
  "SHARE",
  "BRICK",
  "MIGHT",
  "CLOUD",
  "TRACE",
  "SMILE"
];

// Evaluates each letter in a submitted guess.
function evaluateGuess(guess, solution) {
  const result = Array(5).fill("absent");
  const remaining = solution.split("");

  // First pass: identify letters in the correct position.
  guess.split("").forEach((letter, index) => {
    if (letter === solution[index]) {
      result[index] = "correct";
      remaining[index] = null;
    }
  });

  // Second pass: identify letters in the wrong position.
  guess.split("").forEach((letter, index) => {
    if (result[index] === "correct") return;

    const matchIndex = remaining.indexOf(letter);

    if (matchIndex !== -1) {
      result[index] = "present";
      remaining[matchIndex] = null;
    }
  });

  return result;
}

export default function App() {

  const [solutionWord, setSolutionWord] = useState(
    () => WORDS[Math.floor(Math.random() * WORDS.length)]
  );

  const [currentGuess, setCurrentGuess] = useState("");

  const [pastGuesses, setPastGuesses] = useState([]);

  const [gameStatus, setGameStatus] = useState("IN_PROGRESS");

  const [message, setMessage] = useState("");

  // Calculate feedback for completed guesses.
  const evaluations = useMemo(
    () => pastGuesses.map((guess) =>
      evaluateGuess(guess, solutionWord)
    ),
    [pastGuesses, solutionWord]
  );

  // Synchronize the virtual keyboard with evaluated guesses.
  const keyboardStatuses = useMemo(() => {

    const priority = {
      absent: 1,
      present: 2,
      correct: 3
    };

    const statuses = {};

    pastGuesses.forEach((guess, rowIndex) => {

      guess.split("").forEach((letter, columnIndex) => {

        const status = evaluations[rowIndex][columnIndex];

        if (
          !statuses[letter] ||
          priority[status] > priority[statuses[letter]]
        ) {
          statuses[letter] = status;
        }

      });

    });

    return statuses;

  }, [pastGuesses, evaluations]);

  // Submit the current guess.
  const submitGuess = useCallback(() => {

    if (gameStatus !== "IN_PROGRESS") return;

    if (currentGuess.length !== 5) {
      setMessage("Enter a five-letter word.");
      return;
    }

    const nextGuesses = [...pastGuesses, currentGuess];

    setPastGuesses(nextGuesses);

    setCurrentGuess("");

    setMessage("");

    if (currentGuess === solutionWord) {

      setGameStatus("WON");

    } else if (nextGuesses.length === 6) {

      setGameStatus("LOST");

    }

  }, [
    currentGuess,
    gameStatus,
    pastGuesses,
    solutionWord
  ]);

  // Handle physical and virtual keyboard input.
  const handleKey = useCallback((key) => {

    if (gameStatus !== "IN_PROGRESS") return;

    if (key === "ENTER") {
      submitGuess();
      return;
    }

    if (key === "BACKSPACE") {

      setCurrentGuess(previous => previous.slice(0, -1));

      setMessage("");

      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {

      setCurrentGuess(previous => previous + key);

      setMessage("");

    }

  }, [currentGuess.length, gameStatus, submitGuess]);

  // Listen for physical keyboard events.
  useEffect(() => {

    const onKeyDown = (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        handleKey("ENTER");

      } else if (event.key === "Backspace") {

        event.preventDefault();

        handleKey("BACKSPACE");

      } else if (/^[a-zA-Z]$/.test(event.key)) {

        handleKey(event.key.toUpperCase());

      }

    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };

  }, [handleKey]);

  // Start a new game.
  const restartGame = () => {

    const alternatives = WORDS.filter(
      word => word !== solutionWord
    );

    setSolutionWord(
      alternatives[Math.floor(Math.random() * alternatives.length)]
    );

    setCurrentGuess("");

    setPastGuesses([]);

    setGameStatus("IN_PROGRESS");

    setMessage("");

  };

  return (

    <main className="app-shell">

      <header className="game-header">

        <h1>WORDLE</h1>

        <p className="subtitle">
          A five-letter puzzle
        </p>

      </header>

      <section className="game-area">

        <GameBoard
          pastGuesses={pastGuesses}
          currentGuess={currentGuess}
          evaluations={evaluations}
        />

        <p className="message" role="status" aria-live="polite">
          {message}
        </p>

        <Keyboard
          onKey={handleKey}
          statuses={keyboardStatuses}
          disabled={gameStatus !== "IN_PROGRESS"}
        />

      </section>

      {gameStatus !== "IN_PROGRESS" && (

        <GameModal
          status={gameStatus}
          solution={solutionWord}
          attempts={pastGuesses.length}
          onRestart={restartGame}
        />

      )}

      <footer className="footer">
        Six attempts. One hidden word.
      </footer>

    </main>

  );

}