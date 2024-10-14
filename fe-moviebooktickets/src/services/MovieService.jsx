import axios from "axios";

export default class MovieService {
  static BASE_URL = "http://localhost:8080/api/v1/movie";

  static async getAllMovies() {
    try {
      const response = await axios.get(`${this.BASE_URL}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async getMovie(movieId) {
    try {
      const response = await axios.get(`${this.BASE_URL}/${movieId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async getShowTimeByMovieIdOf7Day(movieId, date) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/showtime?movieId=${movieId}&date=${date}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async InsertMovie(formData) {
    try {
      const response = await axios.post(`${this.BASE_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async UpdateMovie(movieId, formData) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/${movieId}`,
        formData,
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

  static async DeleteMovie(movieId) {
    try {
      const response = await axios.delete(`${this.BASE_URL}/${movieId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 3 bộ phim có doanh thu cao nhất
  static async getTop3Movies() {
    try {
      const response = await axios.get(`${this.BASE_URL}/top-revenue`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Phim có thời lượng dưới 90 phút được phát hành trong năm 2024
  static async getMoviesReleasedIn2024() {
    try {
      const response = await axios.get(`${this.BASE_URL}/short-movie`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getRevenueByMovie(movieName) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/revenue?name=${movieName}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  // Thể loại được đặt vé nhiều nhất
  static async getMostTicketGenre() {
    try {
      const response = await axios.get(`${this.BASE_URL}/favorite-category`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
