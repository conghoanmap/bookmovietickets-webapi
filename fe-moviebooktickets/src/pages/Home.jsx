import React, { useEffect, useState } from "react";
import MovieCard from "../components/default/movie/MovieCard";
import { MovieService } from "../services";
import { Link } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [moviesDurationLessThan90, setMoviesDurationLessThan90] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await MovieService.getMoviesReleasedIn2024();
        // console.log(response);
        setMoviesDurationLessThan90(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Xin chào đã đến với
              <strong className="font-extrabold text-red-700 sm:block">
                Moveek
              </strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed">
              Trang web cung cấp thông tin về phim, lịch chiếu, giá vé và đặt
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                className="block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                to="/movie"
              >
                Đặt vé ngay
              </Link>

              <Link
                className="block w-full rounded px-12 py-3 text-sm font-medium text-red-600 shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
                to="/about"
              >
                Giới thiệu
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto my-10">
        <div className="flex gap-4 overflow-auto">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} type="Phim hay" />
          ))}
        </div>
      </div>

      <div className="container mx-auto">
        <h2 className="mt-5 text-3xl text-center">Vừa phát hành(Huy)</h2>
        <h6 className="mb-5 italic text-center">(Các phim có thời lượng dưới 90 phút được phát hành trong năm 2024(Huy))</h6>
        <div className="flex gap-4 overflow-auto">
          {moviesDurationLessThan90.map((movie) => (
            <MovieCard key={movie.id} movie={movie} type="Mới" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
