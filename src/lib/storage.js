import { emptyData } from "./data";
import { parseBackup, validateData } from "./validation";
export const DATA_KEY = "fintrack:data:v1";
export function readData(storage) {
  const text = storage.getItem(DATA_KEY);
  return text === null ? emptyData() : parseBackup(text);
}
export function writeData(storage, data) {
  const next = validateData(data);
  storage.setItem(DATA_KEY, JSON.stringify(next));
  return next;
}
export function clearData(storage) {
  storage.removeItem(DATA_KEY);
  return emptyData();
}
