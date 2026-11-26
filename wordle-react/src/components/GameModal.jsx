export default function GameModal({
  status,
  solution,
  attempts,
  onRestart
}) {

  const won = status === "WON";

  return (

    <div className="modal-backdrop">

      <section className="modal">

        <h2>
          {won ? "Brilliant!" : "Game over"}
        </h2>

        <p>
          {won
            ? `You found the word in ${attempts} guesses.`
            : "The correct word was:"}
        </p>

        <strong className="solution">
          {solution}
        </strong>

        <button
          className="restart-button"
          onClick={onRestart}
        >
          Play again
        </button>

      </section>

    </div>

  );

}