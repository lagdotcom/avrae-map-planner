const prefix = "lagvtt-";

export function pload<T>(key: string): T | undefined {
  const item = localStorage.getItem(prefix + key);
  if (item) return JSON.parse(item) as T;
}

export function psave<T>(key: string, data: T): void {
  localStorage.setItem(prefix + key, JSON.stringify(data));
}

export function pdel(key: string): void {
  localStorage.removeItem(prefix + key);
}
