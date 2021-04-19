import React from "react";

export default function EnumInput<T extends string>({
  empty,
  label,
  value,
  options,
  onChange,
}: {
  empty?: string;
  label?: (value: T) => string;
  value: T | undefined;
  options: T[];
  onChange: (value: T | undefined) => void;
}): JSX.Element {
  function resolve(val: string) {
    if (val !== empty) return val as T;
    return undefined;
  }

  return (
    <select value={value} onChange={(e) => onChange(resolve(e.target.value))}>
      {empty && <option>{empty}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {label ? label(o) : o}
        </option>
      ))}
    </select>
  );
}
