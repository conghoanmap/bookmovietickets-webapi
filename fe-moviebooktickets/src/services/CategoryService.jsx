import axios from "axios";

export default class CategoryService {
  static BASE_URL = "http://localhost:8080/api/v1/category";

  static async GetAllCategories() {
    try {
      const response = await axios.get(`${this.BASE_URL}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async InsertCategory(category) {
    console.log(category);
    
    try {
      const response = await axios.post(`${this.BASE_URL}`, category, {
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
