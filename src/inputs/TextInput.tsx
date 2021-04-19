import React from "react";

export default function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}): JSX.Element {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}
