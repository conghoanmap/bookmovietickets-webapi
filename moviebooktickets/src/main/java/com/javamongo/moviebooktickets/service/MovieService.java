package com.javamongo.moviebooktickets.service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.javamongo.moviebooktickets.dto.MovieDisplay;
import com.javamongo.moviebooktickets.dto.MovieRevenue;
import com.javamongo.moviebooktickets.dto.MovieTickets;
import com.javamongo.moviebooktickets.dto.MyResponse;
import com.javamongo.moviebooktickets.dto.ShowTimeMovie;
import com.javamongo.moviebooktickets.dto.ShowTimeMovie2;
import com.javamongo.moviebooktickets.entity.Movie;
import com.javamongo.moviebooktickets.entity.ShowTime;
import com.javamongo.moviebooktickets.repository.MovieRepository;
import com.javamongo.moviebooktickets.repository.ShowTimeRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ShowTimeRepository showTimeRepository;

    public MyResponse<List<MovieDisplay>> getAllMovies() {
        MyResponse<List<MovieDisplay>> myResponse = new MyResponse<>();
        List<Movie> movies = movieRepository.findAll();
        List<MovieDisplay> movieDisplays = new ArrayList<>();
        for (Movie movie : movies) {
            List<ShowTime> showTimes = showTimeRepository.findByMovieId(movie.getId());
            MovieDisplay movieDisplay = new MovieDisplay();

            for (ShowTime showTime : showTimes) {
                showTime.setMovie(null);
            }
            movieDisplay.setShowTimes(showTimes);
            movieDisplay.setId(movie.getId());
            movieDisplay.setName(movie.getName());
            movieDisplay.setDescription(movie.getDescription());
            movieDisplay.setDuration(movie.getDuration());
            movieDisplay.setLanguages(movie.getLanguages());
            movieDisplay.setCategories(movie.getCategories());
            movieDisplay.setPoster(movie.getPoster());
            movieDisplay.setTrailer(movie.getTrailer());
            movieDisplay.setReleaseDate(movie.getReleaseDate());
            movieDisplays.add(movieDisplay);
        }
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy danh sách thành công");
        myResponse.setData(movieDisplays);
        return myResponse;
    }

    public MyResponse<MovieDisplay> getMovieById(String id) {
        MyResponse<MovieDisplay> myResponse = new MyResponse<>();
        Movie movie = movieRepository.findById(id).orElse(null);
        if (movie == null) {
            myResponse.setStatus(404);
            myResponse.setMessage("Không tìm thấy phim");
            return myResponse;
        }
        MovieDisplay movieDisplay = new MovieDisplay();
        List<ShowTime> showTimes = showTimeRepository.findByMovieId(movie.getId());

        for (ShowTime showTime : showTimes) {
            showTime.setMovie(null);
        }

        movieDisplay.setShowTimes(showTimes);
        movieDisplay.setId(movie.getId());
        movieDisplay.setName(movie.getName());
        movieDisplay.setDescription(movie.getDescription());
        movieDisplay.setDuration(movie.getDuration());
        movieDisplay.setLanguages(movie.getLanguages());
        movieDisplay.setCategories(movie.getCategories());
        movieDisplay.setPoster(movie.getPoster());
        movieDisplay.setTrailer(movie.getTrailer());
        movieDisplay.setReleaseDate(movie.getReleaseDate());

        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thông tin thành công");
        myResponse.setData(movieDisplay);
        return myResponse;
    }

    public MyResponse<Movie> saveMovie(Movie movie) {
        MyResponse<Movie> myResponse = new MyResponse<>();
        Optional<Movie> existingMovie = movieRepository.findByName(movie.getName());
        if (existingMovie.isPresent()) {
            myResponse.setStatus(400);
            myResponse.setMessage("Phim đã tồn tại");
            myResponse.setData(existingMovie.get());
            return myResponse;
        }
        myResponse.setStatus(200);
        myResponse.setMessage("Lưu phim thành công");
        myResponse.setData(movieRepository.save(movie));
        return myResponse;
    }

    public MyResponse<?> deleteMovie(String id) {
        movieRepository.deleteById(id);
        MyResponse<?> myResponse = new MyResponse<>();
        myResponse.setStatus(200);
        myResponse.setMessage("Xóa phim thành công");
        return myResponse;
    }

    public MyResponse<List<Movie>> getAllMoviesByCategory(String category) {
        MyResponse<List<Movie>> myResponse = new MyResponse<>();
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy danh sách thành công");
        myResponse
                .setData(movieRepository.findAll().stream().filter(m -> m.getCategories().contains(category)).toList());
        return myResponse;
    }

    public MyResponse<List<MovieRevenue>> getTopRevenueMovies() {
        MyResponse<List<MovieRevenue>> myResponse = new MyResponse<>();
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.unwind("seats"),
                Aggregation.group("showTime.movie._id")
                        .first("showTime.movie.name").as("movieName")
                        .sum("showTime.price").as("totalRevenue"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "totalRevenue")),
                Aggregation.project("showTime.movie._id", "movieName", "totalRevenue"),
                Aggregation.limit(3));

        AggregationResults<MovieRevenue> results = mongoTemplate.aggregate(aggregation, "tickets", MovieRevenue.class);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy danh sách thành công");
        List<MovieRevenue> movieRevenues = results.getMappedResults();
        for (MovieRevenue movieRevenue : movieRevenues) {
            movieRevenue.setMovieId(movieRevenue.get_id().toString());
            movieRevenue.set_id(null);
        }
        myResponse.setData(movieRevenues);
        return myResponse;
    }

    public MyResponse<List<Movie>> getShortMovies() {
        MyResponse<List<Movie>> myResponse = new MyResponse<>();
        LocalDate start = LocalDate.of(2024, 1, 1);
        LocalDate end = LocalDate.of(2025, 1, 1);
        List<Movie> movies = movieRepository.findByDurationLessThanAndReleaseDateBetween(90, start,
                end);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy danh sách thành công");
        myResponse.setData(movies);
        return myResponse;

    }

    public MyResponse<MovieRevenue> getRevenueByMovieName(String name) {
        MyResponse<MovieRevenue> myResponse = new MyResponse<>();
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("showTime.movie.name").is(name)),
                Aggregation.group()
                        .sum("showTime.price").as("totalRevenue"));
        AggregationResults<MovieRevenue> results = mongoTemplate.aggregate(aggregation,
                "tickets", MovieRevenue.class);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy doanh thu thành công");
        myResponse.setData(results.getUniqueMappedResult());
        return myResponse;
    }

    public MyResponse<List<ShowTimeMovie>> getShowTimeByMovieIdAndDate(String movieId, LocalDate date) {
        MyResponse<List<ShowTimeMovie>> myResponse = new MyResponse<>();

        // Tạo truy vấn
        Query query = new Query();
        query.addCriteria(Criteria.where("showTimeDate").gte(date).lt(date.plusDays(7)));
        query.addCriteria(Criteria.where("movie._id").is(movieId));
        query.with(Sort.by(Sort.Direction.ASC, "showTimeDate"));
        query.fields().exclude("movie");

        List<ShowTime> showTimes = mongoTemplate.find(query, ShowTime.class);
        List<ShowTimeMovie> showTimeMovies = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            ShowTimeMovie showTimeMovie = new ShowTimeMovie();
            showTimeMovie.setId(date.plusDays(i).toString());
            int finalI = i;
            List<ShowTime> showTimesOfDay = showTimes.stream()
                    .filter(s -> s.getShowTimeDate() != null && s.getShowTimeDate().equals(date.plusDays(finalI)))
                    .toList();
            showTimesOfDay.forEach(s -> s.setShowTimeDate(null));
            showTimeMovie.setShowTimes(showTimesOfDay);
            showTimeMovies.add(showTimeMovie);

        }
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy danh sách lịch chiếu thành công");
        myResponse.setData(showTimeMovies);
        return myResponse;
    }

    public MyResponse<MovieTickets> getFavoriteCategory() {
        MyResponse<MovieTickets> myResponse = new MyResponse<>();
        Aggregation aggregation = Aggregation.newAggregation(
                // db.tickets.aggregate([
                // {
                // $unwind: "$showTime.movie.categories" // Tách thể loại phim ra từng tài liệu
                // },
                // {
                // $group: {
                // _id: "$showTime.movie.categories", // Nhóm theo thể loại
                // totalTickets: { $sum: 1 } // Đếm số vé được đặt
                // }
                // },
                // {
                // $sort: { totalTickets: -1 } // Sắp xếp theo số vé đặt giảm dần
                // },
                // {
                // $limit: 1 // Lấy thể loại có số vé đặt cao nhất
                // }
                // ]);
                Aggregation.unwind("showTime.movie.categories"),
                Aggregation.group("showTime.movie.categories")
                        .count().as("totalTickets"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "totalTickets").and(Sort.by(Sort.Direction.ASC, "_id"))),
                Aggregation.limit(1));

        AggregationResults<MovieTickets> results = mongoTemplate.aggregate(aggregation, "tickets", MovieTickets.class);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thể loại phim được yêu thích nhất thành công");
        myResponse.setData(results.getUniqueMappedResult());
        return myResponse;
    }

    public MyResponse<List<ShowTimeMovie2>> getShowTimeByMovieIdAndDate2(String movieId, LocalDate date) {
        MyResponse<List<ShowTimeMovie2>> myResponse = new MyResponse<>();
        Date today = new Date();
        Date sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Tạo Aggregation
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("showTimeDate").gte(today).lte(sevenDaysLater)
            .and("movie._id").is(new ObjectId(movieId))),
                Aggregation.group("showTimeDate")
                        .push("$$ROOT").as("showtimes"),
                Aggregation.sort(Sort.by(Sort.Direction.ASC, "date")));

        // Thực hiện truy vấn
        AggregationResults<ShowTimeMovie2> results = mongoTemplate.aggregate(aggregation, "showtimes",
                ShowTimeMovie2.class);

        myResponse.setStatus(200);
        myResponse.setMessage("Lấy danh sách lịch chiếu thành công");
        myResponse.setData(results.getMappedResults());
        return myResponse;
    }

}
