import { ChangeEvent, RefObject, useCallback } from "react";

export default function TextInput({
  forwardRef,
  onChange,
  value,
}: {
  forwardRef?: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  value: string;
}): JSX.Element {
  const change = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return <input ref={forwardRef} value={value} onChange={change} />;
}
