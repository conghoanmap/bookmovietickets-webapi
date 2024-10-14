import React, { useEffect, useState } from "react";
import { MovieService, ShowTimeService } from "../../../services";

const AddShowTime = (props) => {
  const [movies, setMovies] = useState([]);
  const [selectingMovie, setSelectingMovie] = useState(0);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [ticketPrice, setTicketPrice] = useState(20000);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await MovieService.getAllMovies();
        setMovies(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMovies();
  }, []);

  const handleInsertShowTime = async () => {
    const showTime = {
      showTimeDate: props?.date,
      startTime: time,
      price: ticketPrice,
      movieId: movies[selectingMovie]?.id,
      roomId: props?.room,
    };

    try {
      const response = await ShowTimeService.InsertShowTime(showTime);
      console.log(response);
      if (response.status === 200) {
        props?.addShowTimeDisplay(response.data);
        alert("Thêm suất chiếu thành công");
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
            Thêm mới suất chiếu
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Thêm suất chiếu mới vào hệ thống
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Chọn phim
              </label>
              <div className="mt-2">
                <select
                  value={selectingMovie}
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  onChange={(e) => setSelectingMovie(e.target.value)}
                >
                  {movies.map((movie, index) => (
                    <option key={index} value={index}>
                      {movie.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tên phim
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="time"
                  value={time}
                  autoComplete="given-name"
                  placeholder="Tên phim"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Giá vé
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="number"
                  step={5000}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                />
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
          onClick={handleInsertShowTime}
          type="submit"
          className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Lưu phim
        </button>
      </div>
    </div>
  );
};

export default AddShowTime;
