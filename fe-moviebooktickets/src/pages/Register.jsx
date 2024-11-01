import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalProvider";
import { AccountService } from "../services";

const Register = () => {
  const [error, setError] = useState("");
  const [count, setCount] = useState(5);
  const [isCounting, setIsCounting] = useState(false);
  const navigate = useNavigate();
  const context = useContext(GlobalContext);
  const [successRegister, setSuccessRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (count <= 0) return;
    const timeout = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isCounting, count]);

  const handleRegister = async () => {
    console.log(formData);
    
    try {
      const response = await AccountService.Register(formData);
      setFormError({}); // Reset form error
      if (response.statusCode === 200) {
        setSuccessRegister(true);
        // 5s sau chuyển hướng về trang login
        setTimeout(() => {
          navigate("/login");
        }, 5000);
        setCount(5); // Bắt đầu đếm từ 1
        setIsCounting(true); // Bắt đầu đếm
      }
      else{
        setError(response?.message);
      }
    } catch (error) {
      console.log(error);
      
      // Validation
      console.log(error?.response?.data);
      setFormError(error?.response?.data);
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
          Đăng ký tài khoản
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
              <span className="text-red-500 text-sm">{formError.email}</span>
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Họ và tên
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <span className="text-red-500 text-sm">{formError.name}</span>
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
              <span className="text-red-500 text-sm">{formError.password}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Xác nhận mật khẩu
              </label>
            </div>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="confirmPassword"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <span className="text-red-500 text-sm">{formError.confirmPassword}</span>
            </div>
            {successRegister && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-teal-500">
                  <span>
                    Đăng kí thành công, bạn sẽ được chuyển về trang đăng nhập
                    sau {count}s
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-red-500">
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              onClick={handleRegister}
            >
              Đăng ký
            </button>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-rose-600 hover:text-rose-500"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
