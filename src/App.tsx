import { useState } from "react";
import { languages } from "./data/languages";
import { generateRandomWord, getFarewellText } from "./utils";

function App() {
  const [currentWord, setCurrentWord] = useState(() => generateRandomWord());
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const isLastGuessedCorrect = currentWord.includes(
    guessedLetters[guessedLetters.length - 1]
  );
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = [...currentWord].every((letter) =>
    guessedLetters.includes(letter)
  );
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameLost || isGameWon;

  const languagesElements = languages.map((lang, index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    return (
      <span
        key={lang.name}
        style={styles}
        className={wrongGuessCount > index ? "lost" : ""}
      >
        {lang.name}
      </span>
    );
  });

  const lettersElements = [...currentWord].map((letter, index) => {
    return (
      <span
        key={index}
        style={
          !guessedLetters.includes(letter) && isGameLost
            ? { backgroundColor: "#ec5d49" }
            : { backgroundColor: "#323232" }
        }
      >
        {guessedLetters.includes(letter) || isGameLost ? letter : ""}
      </span>
    );
  });

  const keyboardElements = [...alphabet].map((letter) => {
    const className = guessedLetters.includes(letter)
      ? currentWord.includes(letter)
        ? "correct"
        : "wrong"
      : "";
    return (
      <button
        key={letter}
        onClick={() => addGuessedLetter(letter)}
        className={className}
        disabled={isGameOver}
        aria-disabled={isGameOver}
      >
        {letter}
      </button>
    );
  });

  function addGuessedLetter(letter: string) {
    setGuessedLetters((prevLetters) =>
      guessedLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  function newGame() {
    setCurrentWord(generateRandomWord());
    setGuessedLetters([]);
  }

  return (
    <>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <main>
        <section
          className={
            isGameWon
              ? "status game-won"
              : isGameLost
              ? "status game-lost"
              : guessedLetters.length > 0 && !isLastGuessedCorrect
              ? "status farewell"
              : isLastGuessedCorrect
              ? "status correct"
              : "status"
          }
        >
          {isGameWon ? (
            <>
              <span>You win!</span>
              <span>Well done!🎉</span>
            </>
          ) : isGameLost ? (
            <>
              <span>Game over!</span>
              <span>You lose! Better start learning Assembly😭</span>
            </>
          ) : (
            <span>
              {!isLastGuessedCorrect && guessedLetters.length > 0
                ? getFarewellText(languages[wrongGuessCount - 1].name)
                : "Correct Guess! ✔"}
            </span>
          )}
        </section>
        <section className="languages">{languagesElements}</section>
        <section className="word">{lettersElements}</section>
        <section className="keyboard">{keyboardElements}</section>
        {isGameOver && (
          <button className="newgame-button" onClick={newGame}>
            New Game
          </button>
        )}
      </main>
    </>
  );
}

export default App;
