import NumberInput from "./NumberInput";

export default function TableNumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}): JSX.Element {
  return (
    <tr>
      <th>{label}</th>
      <td>
        <NumberInput value={value} onChange={onChange} />
      </td>
    </tr>
  );
}
