import React from "react";

export default function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}): JSX.Element {
  function parse(value: number) {
    return isNaN(value) ? 0 : value;
  }

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parse(e.target.valueAsNumber))}
    />
  );
}
