import { useEffect } from "react";

function keyName(e: KeyboardEvent) {
  const bits = [e.key];
  if (e.altKey && e.key !== "Alt") bits.unshift("alt");
  if (e.ctrlKey && e.key !== "Control") bits.unshift("ctrl");
  if (e.shiftKey && e.key !== "Shift") bits.unshift("shift");

  return bits.join("+");
}

function useGlobalKeyDown(
  callback: (e: KeyboardEvent) => void,
  listen: string[],
  disabled?: boolean
): void {
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = keyName(e);
    if (!listen.includes(key)) return;
    callback(e);
  };

  useEffect(() => {
    if (disabled) return;
    document.addEventListener("keydown", handleKeyDown, false);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });
}
export default useGlobalKeyDown;
