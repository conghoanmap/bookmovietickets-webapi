package com.javamongo.moviebooktickets.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.javamongo.moviebooktickets.dto.MyResponse;
import com.javamongo.moviebooktickets.dto.ShowTimeDto;
import com.javamongo.moviebooktickets.entity.Movie;
import com.javamongo.moviebooktickets.entity.ShowTime;
import com.javamongo.moviebooktickets.repository.MovieRepository;
import com.javamongo.moviebooktickets.repository.ShowTimeRepository;

public class AddShowTimeTest {
    @InjectMocks
    private ShowTimeService showTimeService;
    @Mock
    private MovieRepository movieRepository;
    @Mock
    private ShowTimeRepository showTimeRepository;

    private ShowTimeDto showTimeDto;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @DisplayName("Test ngày chiếu là quá khứ")
    @Test
    public void testAddShowTime_PastDate() {
        // Mô phỏng dữ liệu test
        showTimeDto = new ShowTimeDto();
        showTimeDto.setShowTimeDate(LocalDate.of(2024, 10, 17));
        showTimeDto.setStartTime(LocalTime.of(10, 30));
        showTimeDto.setMovieId("6709d25aedb67755ac4abe8a");
        // Gọi hàm thêm suất chiếu
        MyResponse<ShowTime> response = showTimeService.addShowTime(showTimeDto);
        // So sánh kết quả trả về
        assertEquals(400, response.getStatus());
        assertEquals("Ngày chiếu phải lớn hơn hoặc bằng ngày hiện tại", response.getMessage());
    }

    @DisplayName("Test giờ chiếu là quá khứ")
    @Test
    public void testAddShowTime_PastTime() {
        showTimeDto = new ShowTimeDto();
        showTimeDto.setShowTimeDate(LocalDate.now());
        showTimeDto.setStartTime(LocalTime.of(8, 30).minusHours(1));
        showTimeDto.setMovieId("6709d25aedb67755ac4abe8a");

        MyResponse<ShowTime> response = showTimeService.addShowTime(showTimeDto);
        assertEquals(400, response.getStatus());
        assertEquals("Giờ bắt đầu phải lớn hơn giờ hiện tại", response.getMessage());
    }

    @DisplayName("Test phim không tồn tại")
    @Test
    public void testAddShowTime_MovieNotFound() {
        showTimeDto = new ShowTimeDto();
        showTimeDto.setShowTimeDate(LocalDate.of(2024, 10, 31));
        showTimeDto.setStartTime(LocalTime.of(10, 30));
        showTimeDto.setMovieId("6709d25aedb67755ac4abe8a");

        when(movieRepository.findById("6709d25aedb67755ac4abe8a")).thenReturn(Optional.empty());
        MyResponse<ShowTime> response = showTimeService.addShowTime(showTimeDto);
        assertEquals(404, response.getStatus());
        assertEquals("Không tìm thấy phim", response.getMessage());
    }

    @DisplayName("Suất chiếu trùng ngày/giờ và phòng chiếu")
    @Test
    public void testAddShowTime_OverlappingShowTime() {
        // Dữ liệu mock
        LocalDate showDate = LocalDate.now().plusDays(1);
        LocalTime startTime = LocalTime.of(18, 0);
        int duration = 120; // Thời lượng phim là 120 phút (2 tiếng)

        Movie movie = new Movie();
        movie.setId("1");
        movie.setDuration(duration);

        ShowTimeDto showTimeDto = new ShowTimeDto();
        showTimeDto.setShowTimeDate(showDate);
        showTimeDto.setStartTime(startTime);
        showTimeDto.setRoomId("1");
        showTimeDto.setMovieId("1");

        // Mock movieRepository trả về movie
        when(movieRepository.findById("1")).thenReturn(java.util.Optional.of(movie));

        // Mock showTimeRepository trả về danh sách suất chiếu đã tồn tại
        ShowTime existingShowTime = new ShowTime();
        existingShowTime.setId("1");
        existingShowTime.setShowTimeDate(showDate);
        existingShowTime.setStartTime(LocalTime.of(17, 0));
        existingShowTime.setMovie(movie);
        existingShowTime.setRoomId("1");

        when(showTimeRepository.findAll()).thenReturn(List.of(existingShowTime));

        // Gọi hàm addShowTime và kiểm tra kết quả
        MyResponse<ShowTime> response = showTimeService.addShowTime(showTimeDto);

        // Kiểm tra xem response có mã lỗi 400 hay không
        assertEquals(400, response.getStatus());
        assertEquals("Suất chiếu này có thể bị tràn sang suất chiếu: 1", response.getMessage());

        // Kiểm tra xem không gọi đến save do có trùng lặp
        verify(showTimeRepository, never()).save(any(ShowTime.class));
    }

    @DisplayName("Test thêm suất chiếu thành công")
    @Test
    public void testAddShowTime_Success() {
        showTimeDto = new ShowTimeDto();
        showTimeDto.setShowTimeDate(LocalDate.now());
        showTimeDto.setStartTime(LocalTime.of(10, 30));
        showTimeDto.setMovieId("6709d25aedb67755ac4abe8a");

        ShowTime showTime = new ShowTime();
        showTime.setShowTimeDate(LocalDate.now());
        showTime.setStartTime(LocalTime.of(10, 30));
        showTime.setRoomId("1");

        Movie movie = new Movie();
        movie.setId("6709d25aedb67755ac4abe8a");
        movie.setDuration(120);

        List<ShowTime> showTimes = new ArrayList<>();
        ShowTime showTime1 = new ShowTime();
        showTime1.setShowTimeDate(LocalDate.now());
        showTime1.setStartTime(LocalTime.of(10, 40));
        showTime1.setMovie(movie);
        showTime1.setRoomId("1");
        showTimes.add(showTime1);

        when(showTimeRepository.findAll().stream()
                .filter(s -> s.getShowTimeDate().equals(showTime.getShowTimeDate()))
                .filter(s -> s.getRoomId().equals(showTime.getRoomId()))
                .collect(Collectors.toList())).thenReturn(showTimes);
        when(movieRepository.findById("6709d25aedb67755ac4abe8a")).thenReturn(Optional.of(movie));
        when(showTimeRepository.save(showTime)).thenReturn(showTime);
    }
}
