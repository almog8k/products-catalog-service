export function getMonthAndYearAsDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  // Create a new date with the year and month, setting the day to 1
  const monthAndYearDate = new Date(year, month, 1);
  return monthAndYearDate;
}
