import React, { useEffect, useRef, useState } from "react";
import { MovieService } from "../../services";
import { formatDateYYYYMMDD } from "../../utils";
import InsertMovie from "../../components/dashboard/movie/InsertMovie";
import EditMovie from "../../components/dashboard/movie/EditMovie";
import { Link } from "react-router-dom";
import ViewRevenue from "../../components/dashboard/movie/ViewRevenue";

const listMode = ["add", "edit", "view"];

const MovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [mode, setMode] = useState(); // Xem chi tiết, sửa, xóa
  const [selectedMovie, setSelectedMovie] = useState(0);
  const modalRef = useRef();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await MovieService.getAllMovies();
        // console.log(response);
        setMovies(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleClickOutside = (event) => {
    // Kiểm tra nếu click ra ngoài modalRef thì gọi hàm onClose
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setMode("normal");
    }
  };

  const addMovieDisplay = (movie) => {
    setMovies([...movies, movie]);
  };

  const updateMovieDisplay = (movie) => {
    const index = movies.findIndex((m) => m.id === movie.id);
    const newMovies = [...movies];
    newMovies[index] = movie;
    setMovies(newMovies);
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

  const handleDelete = async (id) => {
    try {
      const response = await MovieService.DeleteMovie(id);
      if (response.status === 200) {
        const newMovies = movies.filter((movie) => movie.id !== id);
        setMovies(newMovies);
        alert(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-5 py-5 my-5">
      {/* Form Xem, sửa, thêm mới film */}
      {mode === "view-revenue" && (
        <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-35">
          <ViewRevenue movieName={movies[selectedMovie]?.name} objectRef={modalRef} />
        </div>
      )}
      {mode === "add" && (
        <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-35">
          <InsertMovie addMovieDisplay={addMovieDisplay} objectRef={modalRef} />
        </div>
      )}
      {mode === "update" && (
        <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-35">
          <EditMovie
            movie={movies[selectedMovie]}
            updateMovieDisplay={updateMovieDisplay}
            objectRef={modalRef}
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
              Movie Manager
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
              {" "}
              Plain Tee{" "}
            </a>
          </li>
        </ol>
      </nav>
      <div>
        <button
          onClick={() => setMode("add")}
          className="my-5 duration-300 inline-flex items-center gap-2 rounded border border-rose-600 bg-rose-600 px-8 py-3 text-white hover:bg-transparent hover:text-rose-600 focus:outline-none focus:ring active:text-rose-500"
        >
          <span className="text-sm font-medium"> Thêm phim mới </span>

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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-2 py-3">
                Mã phim
              </th>
              <th scope="col" className="px-2 py-3">
                Tên phim
              </th>
              <th scope="col" className="px-2 py-3">
                Thời lượng
              </th>
              <th scope="col" className="px-2 py-3">
                Khởi chiếu
              </th>
              <th scope="col" className="px-2 py-3">
                Chi tiết
              </th>
              <th scope="col" className="px-2 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr
                key={movie.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {movie?.id}
                </th>
                <td className="px-2 py-4">{movie?.name}</td>
                <td className="px-2 py-4">{movie?.duration} phút</td>
                <td className="px-2 py-4">
                  {formatDateYYYYMMDD(movie?.releaseDate)}
                </td>
                <td className="px-2 py-4">
                  <Link
                    to={`/movie-detail/${movie.id}`}
                    className="cursor-pointer hover:text-rose-600 duration-300"
                  >
                    Chi tiết
                  </Link>
                </td>
                <td className="px-2 py-4 flex gap-2">
                  <span
                    className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => {
                      setMode("update");
                      setSelectedMovie(index);
                    }}
                  >
                    Sửa
                  </span>
                  <span
                    className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline"
                    onClick={() => handleDelete(movie.id)}
                  >
                    Xóa
                  </span>
                  <span
                    className="cursor-pointer font-medium text-yellow-600 dark:text-yellow-500 hover:underline"
                    onClick={() => {
                      setMode("view-revenue");
                      setSelectedMovie(index);
                    }}
                  >
                    Xem doanh thu(Huy)
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

export default MovieManager;
