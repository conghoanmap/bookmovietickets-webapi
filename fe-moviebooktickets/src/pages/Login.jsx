import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts/GlobalProvider";
import { Link, useNavigate } from "react-router-dom";
import { AccountService } from "../services";

const Login = () => {
  const navigate = useNavigate();
  const context = useContext(GlobalContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const response = await AccountService.Login(formData);
      // console.log(response);

      if (response.statusCode === 200) {
        context.setIsAuthenticated(true);
        context.setRoles(response.roles);
        // console.log(response.roles);
        localStorage.setItem("token", response.token);
        navigate("/");
      } else {
        alert("Đăng nhập thất bại, kiểm tra thông tin đăng nhập");
      }
    } catch (error) {
      alert("Đăng nhập thất bại, lỗi hệ thống");
    }
  };

  const handleResetPassword = async () => {
    if (formData.email === "") {
      alert("Vui lòng nhập email");
      return;
    } else {
      try {
        const response = await AccountService.ResetPassword(formData.email);
        if (response.status === 200) {
          alert("Mật khẩu mới đã được gửi tới email của bạn");
        } else {
          alert("Email không tồn tại");
        }
      } catch (error) {
        alert("Lỗi hệ thống");
      }
    }
  };

  return (
    <div className="bg-white my-10 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://cdn.moveek.com/bundles/ornweb/img/logo.png"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Đăng nhập
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mật khẩu
              </label>
              <div className="text-sm">
                <p
                  onClick={handleResetPassword}
                  className="cursor-pointer font-semibold text-rose-600 hover:text-rose-500"
                >
                  Quên mật khẩu?
                </p>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              onClick={handleLogin}
            >
              Đăng nhập
            </button>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-semibold leading-6 text-rose-600 hover:text-rose-500"
            >
              Đăng kí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
