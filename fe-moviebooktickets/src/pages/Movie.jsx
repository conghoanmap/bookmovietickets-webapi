import React, { useEffect, useState } from "react";
import { MovieService } from "../services";
import MovieCard from "../components/default/movie/MovieCard";

const Movie = () => {
  const [movies, setMovies] = useState([]);

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
  return (
    <div className="bg-white my-10 py-5">
      <div className="p-5 bg-gradient-to-r from-rose-50 to-rose-400">
        <h1 className="text-center mb-4">Phim đang chiếu</h1>
        <span className="text-center flex justify-center">
          Danh sách các phim hiện đang chiếu rạp trên toàn quốc 11/10/2024. Xem
          lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
        </span>
      </div>
      <div className="container mx-auto">
        <div class="grid md:grid-cols-5 gap-4">
          <div className="p-4">
            <div>
              <label
                htmlFor="HeadlineAct"
                className="block text-sm font-medium text-gray-900"
              >
                {" "}
                Headliner{" "}
              </label>

              <select
                name="HeadlineAct"
                id="HeadlineAct"
                className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
              >
                <option value="">Please select</option>
                <option value="JM">John Mayer</option>
                <option value="SRV">Stevie Ray Vaughn</option>
                <option value="JH">Jimi Hendrix</option>
                <option value="BBK">B.B King</option>
                <option value="AK">Albert King</option>
                <option value="BG">Buddy Guy</option>
                <option value="EC">Eric Clapton</option>
              </select>
            </div>
            <div className="my-4">
              <label
                htmlFor="HeadlineAct"
                className="block text-sm font-medium text-gray-900"
              >
                {" "}
                Headliner{" "}
              </label>

              <select
                name="HeadlineAct"
                id="HeadlineAct"
                className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
              >
                <option value="">Please select</option>
                <option value="JM">John Mayer</option>
                <option value="SRV">Stevie Ray Vaughn</option>
                <option value="JH">Jimi Hendrix</option>
                <option value="BBK">B.B King</option>
                <option value="AK">Albert King</option>
                <option value="BG">Buddy Guy</option>
                <option value="EC">Eric Clapton</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="HeadlineAct"
                className="block text-sm font-medium text-gray-900"
              >
                {" "}
                Headliner{" "}
              </label>

              <select
                name="HeadlineAct"
                id="HeadlineAct"
                className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
              >
                <option value="">Please select</option>
                <option value="JM">John Mayer</option>
                <option value="SRV">Stevie Ray Vaughn</option>
                <option value="JH">Jimi Hendrix</option>
                <option value="BBK">B.B King</option>
                <option value="AK">Albert King</option>
                <option value="BG">Buddy Guy</option>
                <option value="EC">Eric Clapton</option>
              </select>
            </div>
          </div>
          <div class="mt-5 md:col-span-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="Mới" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
