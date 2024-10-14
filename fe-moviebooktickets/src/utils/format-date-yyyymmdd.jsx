const formatDateYYYYMMDD = (dateString) => {
  // Chuyển đổi chuỗi ngày thành một đối tượng Date
  const date = new Date(dateString);

  // Lấy năm, tháng và ngày
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày

  // Format thành MM/DD
  return `${year}-${month}-${day}`;
};

export default formatDateYYYYMMDD;
