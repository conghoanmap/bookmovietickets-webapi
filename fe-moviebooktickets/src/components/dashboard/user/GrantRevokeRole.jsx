import React, { useEffect, useState } from "react";
import { AccountService } from "../../../services";

const GrantRevokeRole = (props) => {
  const [roles, setRoles] = useState([
    {
      name: "Customer",
    },
    {
      name: "Admin",
    },
    {
      name: "Staff",
    },
  ]);

  const [rolesSelected, setRolesSelected] = useState(props?.roles);

  useEffect(() => {
    console.log(rolesSelected);
  }, [rolesSelected]);

  const handleGrantRevokeRole = async () => {
    try {
      const response = await AccountService.GrantRevokeRole(props?.id, rolesSelected);
      console.log(response);
      if (response.status === 200) {
        props.updateDisplay(rolesSelected);
        alert("Phân quyền thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      ref={props?.objectRef}
      className="h-5/6 overflow-y-auto rounded-lg w-1/2 border border-solid border-gray-500 bg-white shadow-lg p-5"
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Phân quyền
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Phân quyền cho các người dùng
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="release-date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Chọn quyền
              </label>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {roles.map((role) => (
                  <div key={role.name} className="space-y-2">
                    <label
                      htmlFor="Option3"
                      className="flex cursor-pointer items-start gap-4"
                    >
                      <div className="flex items-center">
                        &#8203;
                        <input
                          type="checkbox"
                          className="size-4 rounded border-gray-300"
                          id="Option3"
                          value={role.name}
                          onChange={(e) => {
                            if (e.target.checked) {
                              console.log(props.roles.includes(role.name));

                              setRolesSelected([...rolesSelected, role.name]);
                            } else {
                              setRolesSelected(
                                rolesSelected.filter(
                                  (item) => item !== role.name
                                )
                              );
                            }
                          }}
                          checked={rolesSelected.includes(role.name)}
                          disabled={role.name === "Customer"}
                        />
                      </div>

                      <div>
                        <strong className="font-medium text-gray-900">
                          {role.name}
                        </strong>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Hủy
        </button>
        <button
          onClick={handleGrantRevokeRole}
          type="submit"
          className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default GrantRevokeRole;
