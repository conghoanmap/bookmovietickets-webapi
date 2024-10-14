import React from "react";
import { formatPrice } from "../../utils";
import { useNavigate } from "react-router-dom";

const ShowTimeCardItem = (props) => {
  const navigate = useNavigate();
  const handleBooking = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      navigate(`/pick-seat/${props.showTime.id}/${props.showTime.price}`);
    }
  };
  return (
    <div className="flex border border-solid border-gray-400 rounded-xl p-2 gap-3">
      <div className="w-1/6 overflow-auto rounded-lg border border-solid border-white">
        <img src={props.poster} alt="" className="w-full" />
      </div>
      <div className="w-5/6 grid gap-2">
        <p>Giờ chiếu: {props.showTime.startTime}</p>
        <p>Phòng: {props.showTime.roomId}</p>
        <p>Rạp: CGV AEON Tân Phú</p>
        <p className="text-sm text-gray-600">
          Địa chỉ: Lầu 3, Aeon Mall 30 Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân Phú,
          Tp. Hồ Chí Minh
        </p>
        <div className="flex">
          <p className="my-auto">
            Giá vé:{" "}
            <span className="text-rose-500 text-2xl">
              {formatPrice(props.showTime.price)}
            </span>
          </p>
          <button
            onClick={handleBooking}
            className="ml-auto my-auto bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md"
          >
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowTimeCardItem;
