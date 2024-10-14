import React, { useEffect, useRef, useState } from "react";
import { formatDateYYYYMMDD, formatPrice } from "../../utils";
import { ShowTimeService } from "../../services";
import { Link } from "react-router-dom";
import AddShowTime from "../../components/dashboard/showtime/AddShowTime";

const listMode = ["add", "edit", "view"];

const ShowTimeManager = () => {
  const [date, setDate] = useState(formatDateYYYYMMDD(new Date()));
  const [rooms, setRooms] = useState([
    "Room A",
    "Room B",
    "Room C",
    "Room D",
    "Room E",
    "Room F",
    "Room G",
    "Room H",
  ]);
  const [selectedRoom, setSelectedRoom] = useState("Room A");
  const [showTimes, setShowTimes] = useState([]);
  const [mode, setMode] = useState("");
  const modalRef = useRef();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ShowTimeService.getAllShowTimes(
          date,
          selectedRoom
        );
        // console.log(response);
        setShowTimes(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [date, selectedRoom]);

  const addShowTimeDisplay = (showTime) => {
    setShowTimes([...showTimes, showTime]);
  };
  return (
    <div className="mx-5 py-5 my-5">
      {mode === "add" && (
        <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-35">
          <AddShowTime addShowTimeDisplay={addShowTimeDisplay} date={date} room={selectedRoom} objectRef={modalRef} />
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
              ShowTime Manager
            </a>
          </li>
        </ol>
      </nav>
      <div className="flex gap-3 my-5">
        <div className="">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Chọn ngày
          </label>
          <div className="mt-2">
            {" "}
            <input
              id="email"
              name="email"
              type="date"
              autoComplete="email"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="my-auto">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <div className="mt-2">
            <select
              value={selectedRoom}
              id="country"
              name="country"
              autoComplete="country-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:max-w-xs sm:text-sm sm:leading-6"
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {rooms.map((room, index) => (
                <option key={index}>{room}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="my-auto">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Thêm suất chiếu
          </label>
          <button
            onClick={() => setMode("add")}
            className="mt-2 duration-300 inline-flex items-center gap-2 rounded border border-rose-600 bg-rose-600 px-8 py-1 text-white hover:bg-transparent hover:text-rose-600 focus:outline-none focus:ring active:text-rose-500"
          >
            <span className="text-sm font-medium"> Thêm suất chiếu </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-2 py-3">
                Mã suất chiếu
              </th>
              <th scope="col" className="px-2 py-3">
                Phim
              </th>
              <th scope="col" className="px-2 py-3">
                Ngày chiếu
              </th>
              <th scope="col" className="px-2 py-3">
                Giờ chiếu
              </th>
              <th scope="col" className="px-2 py-3">
                Phòng chiếu
              </th>
              <th scope="col" className="px-2 py-3">
                Giá vé
              </th>
            </tr>
          </thead>
          <tbody>
            {showTimes.map((showTime, index) => (
              <tr
                key={showTime.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {showTime?.id}
                </th>
                <td className="px-2 py-4">
                  <Link className="hover:text-rose-600" to={`/movie-detail/${showTime?.movie?.id}`}>
                    {showTime?.movie?.name}
                  </Link>
                </td>
                <td className="px-2 py-4">{showTime?.showTimeDate}</td>
                <td className="px-2 py-4">{showTime?.startTime}</td>
                <td className="px-2 py-4">{showTime?.roomId}</td>
                <td className="px-2 py-4">{formatPrice(showTime?.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {showTimes.length === 0 && (
          <div className="flex items-center justify-center h-40">
            <p>Chưa có suất chiếu nào trong ngày {formatDateYYYYMMDD(date)} tại {selectedRoom}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTimeManager;
