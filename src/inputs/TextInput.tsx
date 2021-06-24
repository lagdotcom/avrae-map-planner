import React, { RefObject } from "react";

export default function TextInput({
  forwardRef,
  onChange,
  value,
}: {
  forwardRef?: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  value: string;
}): JSX.Element {
  return (
    <input
      ref={forwardRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
