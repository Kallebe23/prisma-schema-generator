export const isStringsArray = (arr: unknown[]) =>
  arr.every((i) => typeof i === "string");
