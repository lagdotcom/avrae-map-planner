import React, { RefObject } from "react";

import TextInput from "./TextInput";

export default function TableTextInput({
  forwardRef,
  label,
  onChange,
  value,
}: {
  forwardRef?: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  label: string;
  value: string;
}): JSX.Element {
  return (
    <tr>
      <th>{label}</th>
      <td>
        <TextInput forwardRef={forwardRef} value={value} onChange={onChange} />
      </td>
    </tr>
  );
}
