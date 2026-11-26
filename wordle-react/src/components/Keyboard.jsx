const KEY_ROWS = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "ZXCVBNM"
];

export default function Keyboard({
  onKey,
  statuses,
  disabled
}) {

  return (

    <div className="keyboard">

      {KEY_ROWS.map((row, rowIndex) => (

        <div className="key-row" key={row}>

          {rowIndex === 2 && (

            <button
              className="key wide"
              onClick={() => onKey("ENTER")}
              disabled={disabled}
            >
              ENTER
            </button>

          )}

          {row.split("").map(letter => (

            <button
              key={letter}
              className={`key ${statuses[letter] ?? ""}`}
              onClick={() => onKey(letter)}
              disabled={disabled}
            >
              {letter}
            </button>

          ))}

          {rowIndex === 2 && (

            <button
              className="key wide"
              onClick={() => onKey("BACKSPACE")}
              disabled={disabled}
            >
              ⌫
            </button>

          )}

        </div>

      ))}

    </div>

  );

}