import Tile from "./Tile";

export default function Row({
  guess,
  statuses,
  isCurrentRow
}) {

  return (

    <div className="row">

      {Array.from({ length: 5 }, (_, index) => (

        <Tile
          key={index}
          letter={guess[index] ?? ""}
          status={statuses[index] ?? ""}
          isCurrent={
            isCurrentRow && index === guess.length - 1
          }
        />

      ))}

    </div>

  );

}