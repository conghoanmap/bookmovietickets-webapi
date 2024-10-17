package com.javamongo.moviebooktickets.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import com.javamongo.moviebooktickets.entity.Movie;

@DataMongoTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class MovieRepositoryTest {

    @Autowired
    private MovieRepository movieRepository;

    @BeforeEach
    public void setUp() {
        // movieRepository.deleteAll();
    }

    @Test
    public void testSaveMovie() {
        Movie movie = new Movie();

        movie.setName("The Avengers");
        movie.setDuration(120);
        movie.setReleaseDate(new Date());
        movie.setLanguages(List.of("English"));
        movie.setPoster("https://cdn.moveek.com/storage/media/cache/short/66a31dd941628497036893.jpg");
        movie.setTrailer("https://www.youtube.com/embed/inIVdZSFfc0?si=wM5BgcrbQAoXTIJ2");
        movie.setCategories(List.of("Action", "Adventure", "Sci-Fi"));
        movie.setDescription("The Avengers là một bộ phim điện ảnh siêu anh hùng của Mỹ năm 2012 dựa trên nhóm siêu anh hùng cùng tên của Marvel Comics, sản xuất bởi Marvel Studios và phân phối bởi Walt Disney Studios Motion Pictures.");

        movieRepository.save(movie);

        Movie savedMovie = movieRepository.findByName("The Avengers").get();

        assertEquals(movie.getName(), savedMovie.getName());
        assertEquals(movie.getDuration(), savedMovie.getDuration());
        assertEquals(movie.getReleaseDate(), savedMovie.getReleaseDate());
        assertEquals(movie.getLanguages(), savedMovie.getLanguages());
        assertEquals(movie.getPoster(), savedMovie.getPoster());
        assertEquals(movie.getTrailer(), savedMovie.getTrailer());
        assertEquals(movie.getCategories(), savedMovie.getCategories());
        assertEquals(movie.getDescription(), savedMovie.getDescription());

        // Xóa dữ liệu sau khi test
        movieRepository.deleteAllById(List.of(savedMovie.getId()));
    }

}
