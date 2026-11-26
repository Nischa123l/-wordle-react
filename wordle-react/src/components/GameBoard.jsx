import Row from "./Row";

export default function GameBoard({
  pastGuesses,
  currentGuess,
  evaluations
}) {

  return (

    <div className="board">

      {Array.from({ length: 6 }, (_, rowIndex) => {

        const isCurrentRow = rowIndex === pastGuesses.length;

        const guess =
          pastGuesses[rowIndex] ??
          (isCurrentRow ? currentGuess : "");

        const statuses = evaluations[rowIndex] ?? [];

        return (

          <Row
            key={rowIndex}
            guess={guess}
            statuses={statuses}
            isCurrentRow={isCurrentRow}
          />

        );

      })}

    </div>

  );

}