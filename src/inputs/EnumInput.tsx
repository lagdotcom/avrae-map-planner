import { ChangeEvent, useCallback } from "react";

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
  const resolve = useCallback(
    (val: string) => {
      if (val !== empty) return val as T;
      return undefined;
    },
    [empty]
  );

  const change = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => onChange(resolve(e.target.value)),
    [onChange, resolve]
  );

  return (
    <select value={value} onChange={change}>
      {empty && <option>{empty}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {label ? label(o) : o}
        </option>
      ))}
    </select>
  );
}
