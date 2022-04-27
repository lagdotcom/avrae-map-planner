import EnumInput from "./EnumInput";

export default function TableEnumInput<T extends string>({
  empty,
  label,
  value,
  options,
  onChange,
}: {
  empty?: string;
  label: string;
  value: T | undefined;
  options: T[];
  onChange: (value: T | undefined) => void;
}): JSX.Element {
  return (
    <tr>
      <th>{label}</th>
      <td>
        <EnumInput
          empty={empty}
          value={value}
          options={options}
          onChange={onChange}
        />
      </td>
    </tr>
  );
}
