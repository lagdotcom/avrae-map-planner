import { useEffect } from "react";

function useGlobalKeyDown(
  callback: (e: KeyboardEvent) => void,
  listen: string[],
  disabled?: boolean
): void {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!listen.includes(e.key)) return;
    callback(e);
  };

  useEffect(() => {
    if (disabled) return;
    document.addEventListener("keydown", handleKeyDown, false);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });
}
export default useGlobalKeyDown;
