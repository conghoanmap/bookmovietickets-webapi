import axios from "axios";

export default class ShowTimeService {
  static BASE_URL = "http://localhost:8080/api/v1/showtime";

  static async getBookedSeats(showTimeId) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/booked?showTimeId=${showTimeId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getShowTimeById(showTimeId) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/get-showtime?showTimeId=${showTimeId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getAllShowTimes(date, room) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}?showTimeDate=${date}&roomId=${room}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async InsertShowTime(showTime) {
    try {
      const response = await axios.post(`${this.BASE_URL}`, showTime, {
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
