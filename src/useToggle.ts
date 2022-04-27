import { useCallback, useState } from "react";

export default function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((val) => !val), []);

  return [value, toggle];
}
