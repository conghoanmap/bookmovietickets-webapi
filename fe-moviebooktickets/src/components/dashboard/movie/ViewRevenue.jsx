import React, { useEffect, useState } from "react";
import { MovieService } from "../../../services";
import { formatPrice } from "../../../utils";

const ViewRevenue = (props) => {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchMovieRevenue = async () => {
      try {
        const response = await MovieService.getRevenueByMovie(props?.movieName);
        console.log(response);
        
        setRevenue(response.data);
      } catch (error) {
        console.log("Failed to fetch movie revenue: ", error);
      }
    };
    fetchMovieRevenue();
  }, []);

  return (
    <div
      ref={props?.objectRef}
      className="h-5/6 overflow-y-auto rounded-lg w-1/2 border border-solid border-gray-500 bg-white shadow-lg p-5"
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Doanh thu
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Doanh thu của phim {props.movieName}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <h5>
                {props.movieName}: {formatPrice(revenue?.totalRevenue ? revenue.totalRevenue : 0)}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRevenue;
