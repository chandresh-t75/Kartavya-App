export const formatDateTime = async (newDate: any) => {
  const date = new Date(newDate);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short", // Abbreviated month
    year: "numeric",
  }).format(date);
  return formattedDate;
};
