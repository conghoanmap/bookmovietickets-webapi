package com.javamongo.moviebooktickets.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.javamongo.moviebooktickets.dto.MyResponse;
import com.javamongo.moviebooktickets.dto.TicketDto;
import com.javamongo.moviebooktickets.entity.AppUser;
import com.javamongo.moviebooktickets.entity.ShowTime;
import com.javamongo.moviebooktickets.entity.Ticket;
import com.javamongo.moviebooktickets.repository.AppUserRepository;
import com.javamongo.moviebooktickets.repository.ShowTimeRepository;
import com.javamongo.moviebooktickets.repository.TicketRepository;

import io.jsonwebtoken.lang.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

public class TicketServiceTest {
    
    @InjectMocks
    private TicketService ticketService;
    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private ShowTimeRepository showTimeRepository;
    @Mock
    private AppUserRepository userRepository;
    @Mock
    private MongoTemplate mongoTemplate;

    private TicketDto ticketDto;

    @BeforeEach // Đánh dấu phương thức sẽ chạy trước mỗi phương thức test
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        ticketDto = new TicketDto();
        ticketDto.setSeats(List.of("G07", "A01", "A09"));
        ticketDto.setEmail("hoan39800@gmail.com");
        ticketDto.setShowTimeId("6709d25aedb67755ac4abe8a");
    }

    @DisplayName("Test số tiền có bị trừ đi sau khi đặt vé không")
    @Test
    public void testAddTicket_AccountBalance() {
        // Mock dữ liệu
        ShowTime showTime = new ShowTime();
        showTime.setId("6709d25aedb67755ac4abe8a");
        showTime.setShowTimeDate(LocalDate.of(2024, 10, 20));
        showTime.setStartTime(LocalTime.of(21, 30, 00));
        showTime.setPrice(45000);

        AppUser user = new AppUser();
        user.setEmail("hoan39800@gmail.com");

        double oldBalance = 1000000;

        user.setAccountBalance(oldBalance);

        when(showTimeRepository.findById(ticketDto.getShowTimeId())).thenReturn(Optional.of(showTime));
        when(ticketRepository.findByShowTimeId(ticketDto.getShowTimeId())).thenReturn(Collections.emptyList());
        when(userRepository.findByEmail(ticketDto.getEmail())).thenReturn(Optional.of(user));

        // Gọi phương thức service
        MyResponse<Ticket> response = ticketService.addTicket(ticketDto);

        // Kiểm tra kết quả
        assertEquals(200, response.getStatus()); // So sánh giá trị
        assertEquals("Đặt vé thành công", response.getMessage());
        assertEquals(oldBalance - response.getData().getTotalPrice(), user.getAccountBalance());
    
    }

    @DisplayName("Test đặt vé thành công")
    @Test
    public void testAddTicket_Success() {
        // Mock dữ liệu
        ShowTime showTime = new ShowTime();
        showTime.setId("6709d25aedb67755ac4abe8a");
        showTime.setShowTimeDate(LocalDate.of(2024, 10, 20));
        showTime.setStartTime(LocalTime.of(21, 30, 00));
        showTime.setPrice(45000);

        AppUser user = new AppUser();
        user.setEmail("hoan39800@gmail.com");
        user.setAccountBalance(1000000);

        when(showTimeRepository.findById(ticketDto.getShowTimeId())).thenReturn(Optional.of(showTime));
        when(ticketRepository.findByShowTimeId(ticketDto.getShowTimeId())).thenReturn(Collections.emptyList());
        when(userRepository.findByEmail(ticketDto.getEmail())).thenReturn(Optional.of(user));

        // Gọi phương thức service
        MyResponse<Ticket> response = ticketService.addTicket(ticketDto);

        // Kiểm tra kết quả
        assertEquals(200, response.getStatus()); // So sánh giá trị
        assertEquals("Đặt vé thành công", response.getMessage());
        assertNotNull(response.getData()); // Kiểm tra dữ liệu trả về khác null
        // Các loại assert khác: assertTrue, assertFalse, assertNull, assertNotNull,
        // assertArrayEquals, assertIterableEquals, assertLinesMatch, assertAll,
        // assertThrows, assertTimeout
    }

    @DisplayName("Test đặt vé cho ghế đã được đặt")
    @Test
    public void testAddTicket_SeatAlreadyBooked() {
        ShowTime showTime = new ShowTime();
        showTime.setId("6709d25aedb67755ac4abe8a");
        Ticket ticket = new Ticket();
        ticket.setSeats(List.of("A01"));
        // Mock dữ liệu

        when(showTimeRepository.findById(ticketDto.getShowTimeId())).thenReturn(Optional.of(showTime));
        when(ticketRepository.findByShowTimeId(ticketDto.getShowTimeId())).thenReturn(List.of(ticket));
        MyResponse<Ticket> response = ticketService.addTicket(ticketDto);

        assertEquals(400, response.getStatus());
        assertEquals("Ghế A01 đã được đặt", response.getMessage());

    }

    @DisplayName("Test đặt vé cho suất chiếu đã chiếu")
    @Test
    public void testAddTicket_ShowTimeNotFound() {
        // Mock dữ liệu cho trường hợp không tìm thấy suất chiếu
        when(showTimeRepository.findById(ticketDto.getShowTimeId())).thenReturn(Optional.empty());

        // Gọi phương thức service
        MyResponse<Ticket> response = ticketService.addTicket(ticketDto);

        // Kiểm tra kết quả
        assertEquals(400, response.getStatus());
        assertEquals("Không tìm thấy suất chiếu", response.getMessage());
    }

    @DisplayName("Test đặt vé cho suất chiếu đã chiếu")
    @Test
    public void testAddTicket_InsufficientBalance() {
        // Mock dữ liệu cho trường hợp số dư không đủ
        ShowTime showTime = new ShowTime();
        showTime.setId("1");
        showTime.setShowTimeDate(LocalDate.now().plusDays(1));
        showTime.setStartTime(LocalTime.now().plusHours(2));
        showTime.setPrice(100);

        AppUser user = new AppUser();
        user.setEmail("test@example.com");
        user.setAccountBalance(50);

        when(showTimeRepository.findById(ticketDto.getShowTimeId())).thenReturn(Optional.of(showTime));
        when(ticketRepository.findByShowTimeId(ticketDto.getShowTimeId())).thenReturn(Collections.emptyList());
        when(userRepository.findByEmail(ticketDto.getEmail())).thenReturn(Optional.of(user));

        // Gọi phương thức service
        MyResponse<Ticket> response = ticketService.addTicket(ticketDto);

        // Kiểm tra kết quả
        assertEquals(400, response.getStatus());
        assertEquals("Số dư không đủ", response.getMessage());
    }

    @DisplayName("Test đặt vé cho trường hợp quá thời gian đặt vé khi đặt ngày của quá khứ")
    @Test
    public void testAddTicket_ExpiredTime() {
        // Mock dữ liệu cho trường hợp quá thời gian đặt vé
        ShowTime showTime = new ShowTime();
        showTime.setId("1");
        //(Đúng), nếu là ngày của quá khứ thì test sẽ pass
        showTime.setShowTimeDate(LocalDate.now().minusDays(1)); // Trừ 1 ngày so với ngày hiện tại
        //(Sai), nếu là ngày của quá khứ thì test sẽ fail
        //showTime.setShowTimeDate(LocalDate.now().plusDays(1)); // Cộng thêm 1 ngày so với ngày hiện tại
        showTime.setStartTime(LocalTime.now()); // Trừ 1 giờ so với thời gian hiện tại
        showTime.setPrice(100);


        AppUser user = new AppUser();
        user.setEmail(ticketDto.getEmail());
        user.setAccountBalance(10000000);

        when(showTimeRepository.findById(ticketDto.getShowTimeId())).thenReturn(Optional.of(showTime));
        when(ticketRepository.findByShowTimeId(ticketDto.getShowTimeId())).thenReturn(Collections.emptyList());
        when(userRepository.findByEmail(ticketDto.getEmail())).thenReturn(Optional.of(user));

        // Gọi phương thức service
        MyResponse<Ticket> response = ticketService.addTicket(ticketDto);
        
        // Kiểm tra kết quả
        assertEquals(400, response.getStatus());
        assertEquals("Hết thời gian đặt vé cho suất chiếu này", response.getMessage());

    }

    @DisplayName("Test đặt vé cho trường hợp quá thời gian đặt vé khi đặt giờ của quá khứ")
    @Test
    public void testAddTicket_ExpiredTime2() {
        // Mock dữ liệu cho trường hợp quá thời gian đặt vé
        ShowTime showTime = new ShowTime();
        showTime.setId("1");
        showTime.setShowTimeDate(LocalDate.now());
        //(Đúng), nếu là giờ của quá khứ thì test sẽ pass
        showTime.setStartTime(LocalTime.now().minusHours(1)); // Trừ 1 giờ so với thời gian hiện tại
        //(Sai), nếu là giờ của quá khứ thì test sẽ fail
        //showTime.setStartTime(LocalTime.now().plusHours(1)); // Cộng thêm 1 giờ so với thời gian hiện tại
        showTime.setPrice(100);

        AppUser user = new AppUser();
        user.setEmail(ticketDto.getEmail());
        user.setAccountBalance(10000000);

        when(showTimeRepository.findById(ticketDto.getShowTimeId())).thenReturn(Optional.of(showTime));
        when(ticketRepository.findByShowTimeId(ticketDto.getShowTimeId())).thenReturn(Collections.emptyList());
        when(userRepository.findByEmail(ticketDto.getEmail())).thenReturn(Optional.of(user));

        // Gọi phương thức service
        MyResponse<Ticket> response = ticketService.addTicket(ticketDto);
        
        // Kiểm tra kết quả
        assertEquals(400, response.getStatus());
        assertEquals("Hết thời gian đặt vé cho suất chiếu này", response.getMessage());

    }


}
