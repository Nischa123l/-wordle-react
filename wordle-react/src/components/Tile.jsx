export default function Tile({
  letter,
  status,
  isCurrent
}) {

  const className = [
    "tile",
    status,
    letter ? "filled" : "",
    isCurrent ? "current" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (

    <div className={className}>

      {letter}

    </div>

  );

}