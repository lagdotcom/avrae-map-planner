import React from "react";

import TextInput from "./TextInput";

export default function TableTextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}): JSX.Element {
  return (
    <tr>
      <th>{label}</th>
      <td>
        <TextInput value={value} onChange={onChange} />
      </td>
    </tr>
  );
}
