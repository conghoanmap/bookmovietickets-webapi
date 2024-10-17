package com.javamongo.moviebooktickets.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import com.javamongo.moviebooktickets.entity.Movie;
import com.javamongo.moviebooktickets.service.MovieService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/movie")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<?> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/category")
    public ResponseEntity<?> getAllMoviesByCategory(@RequestParam String category) {
        return ResponseEntity.ok(movieService.getAllMoviesByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable String id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('Admin')")
    public ResponseEntity<?> addMovie(@Valid @RequestBody Movie movie) {
        return ResponseEntity.ok(movieService.saveMovie(movie));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('Admin')")
    public ResponseEntity<?> updateMovie(@PathVariable String id, @RequestBody Movie movie) {
        movie.setId(id);
        return ResponseEntity.ok(movieService.saveMovie(movie));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('Admin')")
    public ResponseEntity<?> deleteMovie(@PathVariable String id) {
        return ResponseEntity.ok(movieService.deleteMovie(id));
    }

    //(Khánh) Top 3 phim có doanh thu cao nhất
    @GetMapping("/top-revenue")
    public ResponseEntity<?> getTopRevenueMovies() {
        return ResponseEntity.ok(movieService.getTopRevenueMovies());
    }

    // (Huy)Phim có thời lượng dưới 90 phút và được phát hành trong năm 2024
    @GetMapping("/short-movie")
    public ResponseEntity<?> getShortMovies() {
        return ResponseEntity.ok(movieService.getShortMovies());
    }

    // (Huy) Truyền vào tên phim, tính doanh thu của phim đó
    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueByMovieName(@RequestParam String name) {
        return ResponseEntity.ok(movieService.getRevenueByMovieName(name));
    }

    // (Hoan) Xem lịch chiếu của 7 ngày gần nhất tính từ ngày hiện tại của phim có
    // id = id
    @GetMapping("/showtime")
    public ResponseEntity<?> getShowTimeByMovieIdAndDate(@RequestParam String movieId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(movieService.getShowTimeByMovieIdAndDate(movieId, date));
    }

    @GetMapping("/showtime2")
    public ResponseEntity<?> getShowTimeByMovieIdAndDate2(@RequestParam String movieId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(movieService.getShowTimeByMovieIdAndDate2(movieId, date));
    }

    // Thể loại được yêu thích nhất
    @GetMapping("/favorite-category")
    public ResponseEntity<?> getFavoriteCategory() {
        return ResponseEntity.ok(movieService.getFavoriteCategory());
    }
}
