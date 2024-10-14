package com.javamongo.moviebooktickets.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.javamongo.moviebooktickets.entity.Movie;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {
    Optional<Movie> findByName(String name);
    // Phim có thời lượng dưới 90 phút và được phát hành trong năm 2024
    List<Movie> findByDurationLessThanAndReleaseDateBetween(int duration, LocalDate start, LocalDate end);
}
