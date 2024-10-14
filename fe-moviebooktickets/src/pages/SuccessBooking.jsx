import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { TicketService } from "../services";
import { formatDateYYYYMMDD, formatPrice } from "../utils";
import MovieCard from "../components/default/movie/MovieCard";
import { QRCode } from "antd";

const SuccessBooking = () => {
  const [searchParam] = useSearchParams();

  const [ticket, setTicket] = useState({});

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await TicketService.getTicketById(
          searchParam.get("ticketId")
        );
        console.log(response.data);

        setTicket(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTicket();
  }, []);
  return (
    <div className="py-10">
      <h1 className="text-center text-3xl font-semibold my-4">
        Đặt vé thành công
      </h1>
      <div className="w-3/5 bg-white p-5 mx-auto rounded-lg border border-solid border-gray-400">
        <div className="grid grid-cols-2">
          <div className="grid gap-2 my-3">
            {" "}
            <h5 className="font-bold italic text-center">Thông tin vé</h5>
            <p className="md:ml-6">
              Mã vé:{" "}
              <span className="font-semibold text-red-500">{ticket.id}</span>
            </p>
            <p className="md:ml-6">
              Ngày đặt: {formatDateYYYYMMDD(ticket.bookingDate)}
            </p>
            <p className="md:ml-6">Email đặt vé: {ticket.email}</p>
            <MovieCard movie={ticket.showTime?.movie} type="Mới" />
            <p className="md:ml-6">
              Tổng tiền:{" "}
              <span className="text-rose-500 text-3xl font-semibold">
                {formatPrice(ticket.totalPrice)}
              </span>
            </p>
          </div>
          <div className="grid gap-2">
            <QRCode
              className="mx-auto"
              value={
                `http://localhost:8080/api/v1/ticket/check-ticket/${searchParam.get(
                  "ticketId"
                )}` || "-"
              }
            />
            <h6 className="text-center italic text-sm">
              (Vui lòng lưu mã để nhân viên kiểm tra vé)
            </h6>
            <h5 className="font-bold italic text-center">
              Thông tin suất chiếu
            </h5>
            <p className="md:ml-6">Phim: {ticket.showTime?.movie.name}</p>
            <p className="md:ml-6">
              Ngày chiếu: {formatDateYYYYMMDD(ticket.showTime?.showTimeDate)}
            </p>
            <p className="md:ml-6">Giờ chiếu: {ticket.showTime?.startTime}</p>
            <p className="md:ml-6">
              Rạp:{" "}
              <span className="font-semibold text-red-500">
                CGV AEON Tân Phú
              </span>
            </p>
            <p className="md:ml-6">
              Địa chỉ: Lầu 3, Aeon Mall 30 Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân
              Phú, Tp. Hồ Chí Minh
            </p>
          </div>
        </div>
        <div className="flex justify-center my-5">
          <Link
            className="inline-flex items-center gap-2 rounded border border-rose-600 duration-300 bg-rose-600 px-8 py-3 text-white hover:bg-transparent hover:text-rose-600 focus:outline-none focus:ring active:text-rose-500"
            to="/"
          >
            <span className="text-sm font-medium">Về trang chủ</span>

            <svg
              className="size-5 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessBooking;
