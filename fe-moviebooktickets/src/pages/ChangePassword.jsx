import React, { useState } from "react";
import { AccountService } from "../services";
import { useLogout } from "../hooks";

const ChangePassword = () => {
  const logout = useLogout();
  const [success, setSuccess] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleChangePassword = async () => {
    try {
      const response = await AccountService.ChangePassword(formData);
      //   console.log(response);
      if (response.status === 200) {
        setSuccess(response?.message);
        setErrorResponse("");
        logout();
      } else {
        setErrorResponse(response?.message);
        setSuccess("");
      }
    } catch (error) {
      setFormError(error.response?.data);
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
          Đổi mật khẩu
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Mật khẩu cũ
            </label>
            <div className="mt-2">
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                required
                autoComplete="oldPassword"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                value={formData.oldPassword}
                onChange={(e) =>
                  setFormData({ ...formData, oldPassword: e.target.value })
                }
              />
              <span className="text-red-500 text-sm">
                {formError.oldPassword}
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Mật khẩu mới
            </label>
            <div className="mt-2">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                autoComplete="newPassword"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
              <span className="text-red-500 text-sm">
                {formError.newPassword}
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Mật khẩu mới
            </label>
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
              <span className="text-red-500 text-sm">
                {formError.confirmPassword}
              </span>
            </div>
          </div>
          {errorResponse && (
            <div className="text-red-500 text-sm">{errorResponse}</div>
          )}
          {success && (
            <div className="text-teal-500 text-sm">{success}</div>
          )}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              onClick={handleChangePassword}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
