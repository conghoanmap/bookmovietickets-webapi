import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowTimeService from "../services/ShowTimeService";
import { formatPrice } from "../utils";
import { TicketService } from "../services";

const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const selectSeats = [];
rows.forEach((row) => {
  for (let i = 1; i <= 10; i++) {
    const seatNumber = `${row}${String(i).padStart(2, "0")}`; // Số được format thành 2 chữ số
    selectSeats.push(seatNumber);
  }
});
const PickSeat = () => {
  const { showTimeId, priceTicket } = useParams();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await ShowTimeService.getBookedSeats(showTimeId);
        // console.log(response.data);
        setBookedSeats(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSeats();
  }, []);

  useEffect(() => {
    console.log(selectedSeats);
  }, [selectedSeats]);

  const handleSelectSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(
        selectedSeats.filter((selectedSeat) => selectedSeat !== seat)
      );
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    const ticket = {
      showTimeId: showTimeId,
      seats: selectedSeats,
    };
    console.log(ticket);
    try {
      const response = await TicketService.bookingTicket(ticket);
      console.log(response);
      if (response.status === 200) {
        window.location.href = `/success-booking?ticketId=${response.data.id}`;
      }
      else{
        alert(response.message)
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto border border-solid border-rose-500 py-10">
      <div className="flex h-12 px-10">
        {selectedSeats.length > 0 && (
          <button
            className="ml-auto inline-flex items-center gap-2 rounded border border-rose-600 px-8 py-3 text-rose-600 hover:bg-rose-600 hover:text-white focus:outline-none focus:ring duration-300 active:bg-rose-500"
            onClick={handleBooking}
          >
            <span className="text-sm font-medium">
              {" "}
              Đặt vé(Tổng tiền:{" "}
              {formatPrice(selectedSeats.length * priceTicket)}){" "}
            </span>

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
          </button>
        )}
      </div>
      <h1 className="text-center text-2xl text-gray-600">Bảng quy ước</h1>
      <div className="mx-auto flex justify-center gap-10 my-5">
        <div className="flex items-center gap-3">
          <div className="bg-rose-600 text-white p-5 rounded-lg"> </div>
          <span>Ghế đang chọn</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-rose-400 p-5 rounded-lg"> </div>
          <span>Ghế đã đặt</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border p-5 rounded-lg"> </div>
          <span>Ghế trống</span>
        </div>
      </div>
      <div className="w-4/5 mx-auto grid grid-cols-11 gap-3">
        {selectSeats.map((seat) => (
          <React.Fragment key={seat}>
            {seat.includes("08") && <div className=""></div>}
            <div
              className={`${
                bookedSeats?.allSeats?.includes(seat) &&
                "bg-rose-400 text-white"
              } ${selectedSeats.includes(seat) && "bg-rose-600 text-white"} ${
                seat.includes("I", "J") && "mt-10"
              } rounded-lg border border-solid border-rose-500 p-1 text-center cursor-pointer`}
              onClick={() => handleSelectSeat(seat)}
            >
              {seat}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PickSeat;
