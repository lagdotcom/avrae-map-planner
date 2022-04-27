import { Dispatch, SetStateAction, useCallback } from "react";

export default function usePatch<T>(update: Dispatch<SetStateAction<T>>) {
  return useCallback(
    function patch<Field extends keyof T, Value extends T[Field]>(
      field: Field,
      filter?: (value: Value) => Value
    ) {
      return (value: Value) =>
        update((old) => ({
          ...old,
          [field]: filter ? filter(value) : value,
        }));
    },
    [update]
  );
}
