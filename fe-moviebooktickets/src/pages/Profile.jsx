import React, { useEffect, useState } from "react";
import { AccountService, MovieService } from "../services";
import { formatPrice } from "../utils";

const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AccountService.GetProfile();
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="container mx-auto flex">
      <div className="w-3/4 flow-root mx-auto py-5">
      <h1 className="text-center my-5 text-3xl font-semibold">Trang cá nhân</h1>
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Mã người dùng</dt>
            <dd className="text-gray-700 sm:col-span-2">{profile?.id}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Email</dt>
            <dd className="text-gray-700 sm:col-span-2">{profile?.email}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Họ và tên</dt>
            <dd className="text-gray-700 sm:col-span-2">{profile?.name}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Số dư ví</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {formatPrice(profile?.accountBalance)}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Vai trò</dt>
            <dd className="text-gray-700 sm:col-span-2 flex gap-3">
              {profile?.roles?.map((role) => (
                <span
                  key={role.id}
                  className="px-2 py-1 text-sm font-semibold text-white bg-rose-500 rounded-md"
                >
                  {role}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Profile;
