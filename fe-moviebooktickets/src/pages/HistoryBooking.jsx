import React, { useEffect, useState } from "react";
import { TicketService } from "../services";
import { formatDateYYYYMMDD, formatPrice } from "../utils";
import { Alert } from "antd";
import { Link } from "react-router-dom";

const HistoryBooking = () => {
  const [historyBooking, setHistoryBooking] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TicketService.getTicketByUserId();
        console.log(response.data);
        setHistoryBooking(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleCancel = (ticketId) => async () => {
    try {
      const repsonse = await TicketService.cancelTicket(ticketId);
      console.log(repsonse);
      alert(repsonse.message);
      if (repsonse.status === 200) {
        setHistoryBooking(
          historyBooking.filter((ticket) => ticket.id !== ticketId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="container mx-auto py-10">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="my-5 text-center text-3xl font-semibold">
          Lịch sử đặt vé
        </h1>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Mã vé
              </th>
              <th scope="col" className="px-6 py-3">
                Ngày đặt
              </th>
              <th scope="col" className="px-6 py-3">
                Phim
              </th>
              <th scope="col" className="px-6 py-3">
                Số ghế
              </th>
              <th scope="col" className="px-6 py-3">
                Tổng tiền
              </th>
              <th scope="col" className="px-6 py-3">
                Hủy vé
              </th>
            </tr>
          </thead>
          <tbody>
            {historyBooking.map((ticket) => (
              <tr
                key={ticket.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {ticket?.id}
                </th>
                <td className="px-6 py-4">
                  {formatDateYYYYMMDD(ticket.bookingDate)}
                </td>
                <td className="px-6 py-4"><Link className="hover:text-rose-600" to={`/movie-detail/${ticket?.showTime?.movie?.id}`}>
                {ticket?.showTime?.movie?.name}
                </Link></td>
                <td className="px-6 py-4">{ticket?.seats?.length}</td>
                <td className="px-6 py-4">{formatPrice(ticket?.totalPrice)}</td>
                <td className="px-6 py-4">
                  <span
                    onClick={handleCancel(ticket?.id)}
                    className="font-medium text-rose-600 cursor-pointer dark:text-rose-500"
                  >
                    Hủy vé
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

export default HistoryBooking;
