package com.javamongo.moviebooktickets.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.javamongo.moviebooktickets.dto.MyResponse;
import com.javamongo.moviebooktickets.entity.AppUser;
import com.javamongo.moviebooktickets.entity.ShowTime;
import com.javamongo.moviebooktickets.entity.Ticket;
import com.javamongo.moviebooktickets.repository.AppUserRepository;
import com.javamongo.moviebooktickets.repository.ShowTimeRepository;
import com.javamongo.moviebooktickets.repository.TicketRepository;

public class CancelTicketTest {
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

    private String ticketId;
    private String email;

    @BeforeEach // Đánh dấu phương thức sẽ chạy trước mỗi phương thức test
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        ticketId = "60f3b3b3b3b3b3b3b3b3b3b3";
        email = "hoan39800@gmail.com";
    }

    @DisplayName("Hủy vé khi chưa đăng nhập")
    @Test
    public void testCancelTicket_NotLogin() {
        // Mô phỏng dữ liệu trả
        email = "";
        AppUser user = new AppUser();
        user.setEmail("hoan39900@gmail.com");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        // Gọi phương thức service để lấy kết quả
        MyResponse<?> response = ticketService.cancelTicket(ticketId, email);// hàm sẽ test
        // Kiểm tra kết quả
        assertEquals(400, response.getStatus()); // So sánh giá trị
        assertEquals("Bạn chưa đăng nhập", response.getMessage());
    };

    @DisplayName("Hủy vé không tồn tại")
    @Test
    public void testCancelTicket_NotExist() {
        when(ticketRepository.findById(ticketId)).thenReturn(Optional.empty());
        // Gọi phương thức service
        MyResponse<?> response = ticketService.cancelTicket(ticketId, email);
        // Kiểm tra kết quả
        assertEquals(400, response.getStatus()); // So sánh giá trị
        assertEquals("Không tìm thấy vé", response.getMessage());
    };

    @DisplayName("Không có quyền hủy vé")
    @Test
    public void testCancelTicket_NoPermission() {
        Ticket ticket = new Ticket();
        ticket.setId(ticketId);
        ShowTime showTime = new ShowTime();
        showTime.setId("60f3b3b3b3b3b3b3b3b3b3b");
        showTime.setShowTimeDate(LocalDate.of(2024, 10, 31));
        showTime.setStartTime(java.time.LocalTime.now().plusMinutes(30));
        ticket.setShowTime(showTime);
        ticket.setEmail("hoan39900@gmail.com");

        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(showTimeRepository.findById(showTime.getId())).thenReturn(Optional.of(showTime));
        MyResponse<?> response = ticketService.cancelTicket(ticketId, email);
        assertEquals(400, response.getStatus());
        assertEquals("Không có quyền hủy vé", response.getMessage());
    }

    @DisplayName("Hết thời gian hủy vé")
    @Test
    public void testCancelTicket_OutOfTime() {
        Ticket ticket = new Ticket();
        ticket.setId(ticketId);
        ShowTime showTime = new ShowTime();
        showTime.setId("60f3b3b3b3b3b3b3b3b3b3b");
        showTime.setShowTimeDate(LocalDate.of(2024, 10, 27));
        showTime.setStartTime(java.time.LocalTime.now().plusMinutes(30));
        ticket.setShowTime(showTime);
        ticket.setEmail(email);

        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(showTimeRepository.findById(showTime.getId())).thenReturn(Optional.of(showTime));
        MyResponse<?> response = ticketService.cancelTicket(ticketId, email);
        assertEquals(400, response.getStatus());
        assertEquals("Hết thời gian hủy vé", response.getMessage());
    }

    @DisplayName("Hủy vé thất bại do suất chiếu đã bắt đầu hoặc đã kết thúc")
    @Test
    public void testCancelTicket_ShowTimeStarted() {
        Ticket ticket = new Ticket();
        ticket.setId(ticketId);
        ShowTime showTime = new ShowTime();
        showTime.setId("60f3b3b3b3b3b3b3b3b3b3b");
        showTime.setShowTimeDate(LocalDate.of(2024, 10, 27));
        showTime.setStartTime(java.time.LocalTime.now().minusMinutes(30));
        ticket.setShowTime(showTime);
        ticket.setEmail(email);

        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(showTimeRepository.findById(showTime.getId())).thenReturn(Optional.of(showTime));
        MyResponse<?> response = ticketService.cancelTicket(ticketId, email);
        assertEquals(400, response.getStatus());
        assertEquals("Hết thời gian hủy vé", response.getMessage());
    }

    @DisplayName("Hủy vé thành công")
    @Test
    public void testCancelTicket_Success() {
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setAccountBalance(1000000);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        Ticket ticket = new Ticket();
        ticket.setId(ticketId);
        ticket.setSeats(List.of("A01", "A02"));
        ShowTime showTime = new ShowTime();
        showTime.setId("60f3b3b3b3b3b3b3b3b3b3b");
        showTime.setPrice(100000);
        showTime.setShowTimeDate(LocalDate.of(2024, 10, 31));
        showTime.setStartTime(java.time.LocalTime.now().plusMinutes(30));
        ticket.setShowTime(showTime);
        ticket.setEmail(email);

        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(showTimeRepository.findById(showTime.getId())).thenReturn(Optional.of(showTime));
        when(userRepository.save(user)).thenReturn(user);
        // Mô phỏng việc hoàn tiền
        MyResponse<?> response = ticketService.cancelTicket(ticketId, email);
        assertEquals(200, response.getStatus());
        assertEquals("Hủy vé thành công, số tiền hoàn lại: 100000.0", response.getMessage());
        assertEquals(ticket.getSeats().size() * showTime.getPrice() / 2, response.getData());
    }
}
