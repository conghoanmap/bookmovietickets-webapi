package com.javamongo.moviebooktickets.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javamongo.moviebooktickets.dto.StartEndDate;
import com.javamongo.moviebooktickets.dto.TicketDto;
import com.javamongo.moviebooktickets.service.TicketService;

@RestController
@RequestMapping("/api/v1/ticket")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('Admin', 'Customer')")
    public ResponseEntity<?> getAllTickets() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(ticketService.getAllTickets(email));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('Admin', 'Customer')")
    public ResponseEntity<?> addTicket(@RequestBody TicketDto ticket) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        if (ticket.getEmail() == null) {
            ticket.setEmail(email);
        }
        return ResponseEntity.ok(ticketService.addTicket(ticket));
    }

    // Kiểm tra ghế đã được đặt chưa
    @GetMapping("/checkseat/{showTimeId}/{seat}")
    @PreAuthorize("hasAnyAuthority('Admin', 'Customer')")
    public ResponseEntity<?> checkSeat(@PathVariable String showTimeId, @PathVariable String seat) {
        return ResponseEntity.ok(ticketService.checkSeat(showTimeId, seat));
    }

    // (T.Anh)Hủy vé
    @GetMapping("/cancel/{id}")
    @PreAuthorize("hasAnyAuthority('Admin', 'Customer')")
    public ResponseEntity<?> cancelTicket(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(ticketService.cancelTicket(id, email));
    }

    // (T.Anh)Thống kê doanh thu theo n ngày gần nhất
    @GetMapping("/revenue/{n}")
    @PreAuthorize("hasAnyAuthority('Admin')")
    public ResponseEntity<?> getRevenue(@PathVariable int n) {
        return ResponseEntity.ok(ticketService.getRevenue(n));
    }

    // (Khánh) Khách hàng đặt vé nhiều nhất (email)
    @GetMapping("/most-customer")
    public ResponseEntity<?> getMostCustomer() {
        return ResponseEntity.ok(ticketService.getMostCustomer());
    }

    // (Huy) Số vé đã bán cho từng bộ phim
    @GetMapping("/most-movie")
    public ResponseEntity<?> getMostMovie() {
        return ResponseEntity.ok(ticketService.getMostMovie());
    }

    // (Khánh) Tính tổng số vé đã bán trong 1 ngày nhất định
    @GetMapping("/total-ticket")
    public ResponseEntity<?> getTotalTicket(@RequestBody StartEndDate date) {
        return ResponseEntity.ok(ticketService.getTotalTicket(date));
    }

    // Get vé
    @GetMapping("/get-ticket/{ticketId}")
    @PreAuthorize("hasAnyAuthority('Admin', 'Customer')")
    public ResponseEntity<?> getTicket(@PathVariable String ticketId) {
        return ResponseEntity.ok(ticketService.getTicket(ticketId));
    }

    // Kiểm tra vé có hợp lệ không
    @GetMapping("/check-ticket/{ticketId}")
    @PreAuthorize("hasAnyAuthority('Admin', 'Customer')")
    public ResponseEntity<?> checkTicket(@PathVariable String ticketId) {
        return ResponseEntity.ok(ticketService.checkTicket(ticketId));
    }

    // Tính doanh thu theo từng phòng chiếu
    @GetMapping("/revenue-room")
    @PreAuthorize("hasAnyAuthority('Admin')")
    public ResponseEntity<?> getRevenueRoom() {
        return ResponseEntity.ok(ticketService.getRevenueRoom());
    }

    // Tính doanh thu theo từng tháng trong 1 năm trở lại
    @GetMapping("/revenue-year")
    @PreAuthorize("hasAnyAuthority('Admin')")
    public ResponseEntity<?> getRevenueYear() {
        return ResponseEntity.ok(ticketService.getRevenueYear());
    }
}
