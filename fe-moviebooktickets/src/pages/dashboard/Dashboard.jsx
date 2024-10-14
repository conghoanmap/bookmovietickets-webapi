import React, { useEffect, useState } from "react";
import MovieService from "../../services/MovieService";
import { formatPrice } from "../../utils";
import { Link } from "react-router-dom";
import { AccountService, TicketService } from "../../services";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  LineElement,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js mà bạn sẽ sử dụng
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Dashboard = () => {
  // 3 movie có doanh thu cao nhất
  const [topMovies, setTopMovies] = useState([]);
  const [ticketsMovies, setTicketsMovies] = useState([]);
  const [mostBookedMovies, setMostBookedMovies] = useState({
    email: "",
    totalTickets: 0,
  });
  const [userMostBooked, setUserMostBooked] = useState({});
  const [dateNumber, setDateNumber] = useState(7);
  const [revenue, setRevenue] = useState(0);
  const [roomsRevenue, setRoomsRevenue] = useState([]);
  const [mostCategory, setMostCategory] = useState({
    _id: "",
    totalTickets: 0,
  });
  const [revenueInYear, setRevenueInYear] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ["Tháng 1", "Tháng 2", "Tháng 3"],
    datasets: [
      {
        label: "Doanh thu",
        data: [12, 19, 3],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  });

  useEffect(() => {
    const fetchMostCategory = async () => {
      try {
        const response = await MovieService.getMostTicketGenre();
        // console.log(response.data);
        setMostCategory(response.data);
      } catch (error) {
        console.log("Failed to fetch most category: ", error);
      }
    };
    fetchMostCategory();
  }, []);
  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await MovieService.getTop3Movies();
        setTopMovies(response.data);
      } catch (error) {
        console.log("Failed to fetch top movies: ", error);
      }
    };
    fetchTopMovies();
  }, []);

  useEffect(() => {
    const fetchTicketsMovies = async () => {
      try {
        const response = await TicketService.getTicketsByMovie();
        // console.log(response);

        setTicketsMovies(response.data);
      } catch (error) {
        console.log("Failed to fetch top movies: ", error);
      }
    };
    fetchTicketsMovies();
  }, []);

  useEffect(() => {
    const fetchRoomsRevenue = async () => {
      try {
        const response = await TicketService.getRevenueByRoom();
        // console.log(response.data);

        setRoomsRevenue(response.data);
      } catch (error) {
        console.log("Failed to fetch top movies: ", error);
      }
    };
    fetchRoomsRevenue();
  }, []);

  useEffect(() => {
    const fetchMostBookedMovies = async () => {
      try {
        const response = await TicketService.getMostTicketUser();
        if (response.status === 200) {
          setMostBookedMovies(response?.data);
          const res = await AccountService.FindByEmail(response?.data?.email);
          if (res.status === 200) {
            setUserMostBooked(res.data);
          } else {
            setUserMostBooked({
              name: "Không tìm thấy",
            });
          }

          setUserMostBooked(res.data);
        }
      } catch (error) {
        console.log("Failed to fetch top movies: ", error);
      }
    };
    fetchMostBookedMovies();
  }, []);

  useEffect(() => {
    const fetchRevenueInYear = async () => {
      try {
        const response = await TicketService.getRevenueByMonth();
        // console.log(response.data);

        if (response.status === 200) {
          setRevenueInYear(response.data);
          
          setChartData({
            // response.data?.map(item => `Tháng ${item._id.month}/${item._id.year}`)
            labels: response.data?.map(item => `Tháng ${item._id.month}/${item._id.year}`),
            datasets: [
              {
                label: "Doanh thu theo tháng trong năm",
                data: response.data?.map(item => item.totalRevenue),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
              },
            ],
          });
        }
      } catch (error) {
        console.log("Failed to fetch revenue in year: ", error);
      }
    };
    fetchRevenueInYear();
  }, []);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await TicketService.getRevenueByDate(dateNumber);
        setRevenue(response.data);
      } catch (error) {
        console.log("Failed to fetch top movies: ", error);
      }
    };
    fetchRevenue();
  }, [dateNumber]);

  return (
    <div className="p-5">
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
              Dashboard
            </a>
          </li>
        </ol>
      </nav>
      <div className="grid grid-cols-3 my-5 gap-5">
      <div className="border border-solid p-3 col-span-2 bg-white rounded-lg">
        <h5 className="my-3 text-center">
            Doanh thu theo tháng trong năm(Hoan)
          </h5>
          <Bar data={chartData && chartData} />
        </div>
        <div className="border border-solid p-3 bg-white rounded-lg grid">
          <h5 className="my-3 text-center">
            Doanh thu trong {dateNumber} ngày gần nhất(Hoan)
          </h5>
          <div className="mx-auto my-3">
            <div className="mt-2">
              <input
                type="number"
                value={dateNumber}
                className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                onChange={(e) => {
                  if (e.target.value < 1) {
                    setDateNumber(1);
                  } else {
                    setDateNumber(e.target.value);
                  }
                }}
              />
            </div>
          </div>
          <h1 className="text-rose-500 font-semibold text-4xl text-center">
            {formatPrice(revenue?.totalRevenueAll)}
          </h1>
        </div>
        <div className="border border-solid p-3 bg-white rounded-lg h-80 grid overflow-y-auto">
          <h5 className="my-3">
            Số lượng vé đã được đặt cho từng bộ phim(Huy)
          </h5>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-2 py-3">
                  Tên phim
                </th>
                <th scope="col" className="px-2 py-3">
                  Số lượng vé đã đặt
                </th>
              </tr>
            </thead>
            <tbody>
              {ticketsMovies?.map((movie, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link
                      className="hover:text-rose-500"
                      to={`/movie-detail/${movie?.movieId}`}
                    >
                      {movie?._id}
                    </Link>
                  </th>
                  <td className="px-2 py-4">{movie?.totalTickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-solid p-3 bg-white rounded-lg grid">
          <h5 className="my-3 text-center">Khách hàng nổi trội nhất(Hoan)</h5>
          <img
            className="m-auto"
            src="https://cdn-icons-png.flaticon.com/128/10650/10650732.png"
            alt=""
          />
          <h1 className="text-center text-3xl text-rose-500">
            {mostBookedMovies?.email}
          </h1>
          <h4 className="text-center">
            Số vé đã đặt:{" "}
            <span className="text-3xl text-rose-500">
              {mostBookedMovies?.totalTickets}
            </span>
          </h4>
        </div>
        <div className="border border-solid p-3 bg-white rounded-lg grid">
          <h5 className="my-3">Top 3 phim có doanh thu cao nhất(Hoan)</h5>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-2 py-3">
                  Tên phim
                </th>
                <th scope="col" className="px-2 py-3">
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody>
              {topMovies.map((movie, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link
                      className="hover:text-rose-500"
                      to={`/movie-detail/${movie?.movieId}`}
                    >
                      {movie?.movieName}
                    </Link>
                  </th>
                  <td className="px-2 py-4">
                    {formatPrice(movie?.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-solid p-3 bg-white rounded-lg grid h-80 overflow-y-auto">
          <h5 className="my-3">Doanh thu cho từng phòng(Hoan)</h5>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-2 py-3">
                  Mã phòng
                </th>
                <th scope="col" className="px-2 py-3">
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody>
              {roomsRevenue.map((room, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-2 py-4">{room?._id}</td>
                  <td className="px-2 py-4">
                    {formatPrice(room?.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-solid p-3 bg-white rounded-lg grid">
          <h5 className="my-3 text-center">
            Thể loại được đặt vé nhiều nhất(T.Anh)
          </h5>
          <img
            className="m-auto"
            src="https://cdn-icons-png.flaticon.com/128/10650/10650732.png"
            alt=""
          />
          <h1 className="text-center text-3xl text-rose-500">
            {mostCategory?._id}
          </h1>
          <h4 className="text-center">
            Số vé đã đặt:{" "}
            <span className="text-3xl text-rose-500">
              {mostCategory?.totalTickets}
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
