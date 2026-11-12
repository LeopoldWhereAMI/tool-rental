export const formatExtensionDate = (date: string) => {
  return new Date(date).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getInstrumentWord = (count: number) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "инструмент";
  }

  if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 10 || count % 100 >= 20)
  ) {
    return "инструмента";
  }

  return "инструментов";
};
