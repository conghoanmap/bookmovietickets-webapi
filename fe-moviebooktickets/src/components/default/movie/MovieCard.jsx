import React from "react";
import { Link } from "react-router-dom";
import { formatDateMMDD } from "../../../utils";

const MovieCard = (props) => {
  return (
    <div className="relative w-36 m-auto border border-solid border-gray-300 overflow-hidden rounded-lg">
      {props.type && (
        <span className="absolute text-sm text-white px-2 py-1 top-4 bg-red-500 rounded-r-lg">
          {props.type}
        </span>
      )}
      <img src={props.movie?.poster} alt="" />
      <div className="p-2 w-full truncate">
        <Link
          to={`/movie-detail/${props.movie?.id}`}
          className="text-sm hover:text-rose-400 my-2"
        >
          {props.movie?.name}
        </Link>
        <div className="flex">
          <span className="text-sm text-rose-400">
            {formatDateMMDD(props.movie?.releaseDate)}
          </span>
          <span className="ml-auto text-sm text-gray-400">
            {props.movie?.duration}m
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
