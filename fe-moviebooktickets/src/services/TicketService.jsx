import axios from "axios";

export default class TicketService {
  static BASE_URL = "http://localhost:8080/api/v1/ticket";

  static async getTicketById(ticketId) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/get-ticket/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  static async bookingTicket(ticket) {
    try {
      const response = await axios.post(`${this.BASE_URL}`, ticket, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  static async getTicketByUserId() {
    try {
      const response = await axios.get(`${this.BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  static async cancelTicket(ticketId) {
    try {
      const response = await axios.get(`${this.BASE_URL}/cancel/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Lấy số lượng vé đã đặt cho từng bộ phim
  static async getTicketsByMovie() {
    try {
      const response = await axios.get(`${this.BASE_URL}/most-movie`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Khách hàng đặt nhiều vé nhất
  static async getMostTicketUser() {
    try {
      const response = await axios.get(`${this.BASE_URL}/most-customer`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //Doanh thu trong n ngày gần nhất
  static async getRevenueByDate(dateNumber) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/revenue/${dateNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Tính doanh thu cho từng phòng
  static async getRevenueByRoom() {
    try {
      const response = await axios.get(`${this.BASE_URL}/revenue-room`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Tính doanh thu trong 12 tháng gần nhất
  static async getRevenueByMonth() {
    try {
      const response = await axios.get(`${this.BASE_URL}/revenue-year`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
