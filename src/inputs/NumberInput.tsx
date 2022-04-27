import { ChangeEvent, useCallback } from "react";

function parse(value: number) {
  return isNaN(value) ? 0 : value;
}

export default function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}): JSX.Element {
  const change = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      onChange(parse(e.target.valueAsNumber)),
    [onChange]
  );

  return <input type="number" value={value} onChange={change} />;
}
