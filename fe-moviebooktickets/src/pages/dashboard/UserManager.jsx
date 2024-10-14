import React, { useEffect, useRef, useState } from "react";
import { AccountService } from "../../services";
import GrantRevokeRole from "../../components/dashboard/user/GrantRevokeRole";

const listMode = ["add", "edit", "view"];

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState(); // Phân quyền, xóa
  const modalRef = useRef();
  const [selectedUser, setSelectedUser] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AccountService.GetAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const handleClickOutside = (event) => {
    // Kiểm tra nếu click ra ngoài modalRef thì gọi hàm onClose
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setMode("normal");
    }
  };

  useEffect(() => {
    // Lắng nghe sự kiện click khi component được mount
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Xóa sự kiện khi component bị unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Vô hiệu hóa thanh cuộn nếu modal mở
    if (listMode.includes(mode)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mode]);

  const UpdateDisplay = (roles) => {
    setUsers((prev) => {
      const newUsers = [...prev];
      newUsers[selectedUser].roles = roles;
      return newUsers;
    });
  };

  const handleDelete = async (userId) => {
    try {
      const response = await AccountService.DeleteUser(userId);
      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== userId));
        alert("Xóa người dùng thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-5 py-5 my-5">
      {mode === "grant-revoke" && (
        <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-35">
          <GrantRevokeRole
            updateDisplay={UpdateDisplay}
            objectRef={modalRef}
            roles={users[selectedUser]?.roles}
            id={users[selectedUser]?.id}
          />
        </div>
      )}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-gray-600">
          <li>
            <a href="#" className="block transition hover:text-gray-700">
              <span className="sr-only"> Admin </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </a>
          </li>

          <li className="rtl:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>

          <li>
            <a href="#" className="block transition hover:text-gray-700">
              Admin
            </a>
          </li>

          <li className="rtl:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>

          <li>
            <a href="#" className="block transition hover:text-gray-700">
              User Manager
            </a>
          </li>
        </ol>
      </nav>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-2 py-3">
                Mã người dùng
              </th>
              <th scope="col" className="px-2 py-3">
                Tên người dùng
              </th>
              <th scope="col" className="px-2 py-3">
                Email
              </th>
              <th scope="col" className="px-2 py-3">
                Số dư
              </th>
              <th scope="col" className="px-2 py-3">
                Vai trò
              </th>
              <th scope="col" className="px-2 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user?.id}
                </th>
                <td className="px-2 py-4">{user?.name}</td>
                <td className="px-2 py-4">{user?.email}</td>
                <td className="px-2 py-4">XXXXXX</td>
                <td className="px-2 py-4">
                  {user?.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-block px-2 py-1 text-xs font-semibold leading-none text-blue-800 bg-blue-200 rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </td>
                <td className="px-2 py-4 flex gap-2">
                  <span
                    className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => {
                      setSelectedUser(index);
                      setMode("grant-revoke");
                    }}
                  >
                    Phân quyền
                  </span>
                  <span
                    className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline"
                    onClick={() => handleDelete(user.id)}
                  >
                    Xóa
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
