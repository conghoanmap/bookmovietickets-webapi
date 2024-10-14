import axios from "axios";

export default class AccountService {
  static BASE_URL = "http://localhost:8080/api/v1/account";

  static async Login(formData) {
    try {
      const response = await axios.post(`${this.BASE_URL}/login`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async Register(formData) {
    try {
      const response = await axios.post(`${this.BASE_URL}/register`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async GetProfile() {
    try {
      const response = await axios.get(`${this.BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async GetRoles() {
    try {
      const response = await axios.get(`${this.BASE_URL}/get-roles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async GetAllUsers() {
    try {
      const response = await axios.get(`${this.BASE_URL}/get-all-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async GrantRevokeRole(userId, roles) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/grant-revoke-role?id=${userId}`,
        roles,
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

  static async DeleteUser(userId) {
    try {
      const response = await axios.delete(
        `${this.BASE_URL}/delete-user?id=${userId}`,
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

  static async FindByEmail(email) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/get-by-email?email=${email}`,
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

  // Đăng xuất
  static Logout() {
    localStorage.removeItem("token");
  }

  // Kiểm tra đăng nhập
  static isAuthenticated() {
    const token = localStorage.getItem("token");
    // console.log('token', token);
    return token !== null;
  }
}
