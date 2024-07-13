export const getLocalDateString = (date: Date) => {
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(date.getTime() - tzoffset)
    .toISOString()
    .slice(0, 16);
  return localISOTime;
};

export const getDateFromLocalDateString = (dateStr: unknown) => {
  if (typeof dateStr !== "string") {
    return new Date();
  }
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const isoTime = new Date(dateStr + ":00Z");
  isoTime.setTime(isoTime.getTime() + tzoffset);

  return isoTime;
};
