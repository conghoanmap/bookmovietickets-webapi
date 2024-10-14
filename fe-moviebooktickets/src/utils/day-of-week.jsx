const dayOfWeek = (date) => {
  const day = new Date(date).getDay();
  switch (day) {
    case 0:
      return "CN";
    case 1:
      return "Th 2";
    case 2:
      return "Th 3";
    case 3:
      return "Th 4";
    case 4:
      return "Th 5";
    case 5:
      return "Th 6";
    case 6:
      return "Th 7";
    default:
      return "";
  }
};
export default dayOfWeek;
