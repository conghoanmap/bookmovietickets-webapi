package com.javamongo.moviebooktickets.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import com.javamongo.moviebooktickets.dto.MostBookedCustomers;
import com.javamongo.moviebooktickets.dto.MovieTickets;
import com.javamongo.moviebooktickets.dto.MyResponse;
import com.javamongo.moviebooktickets.dto.RevenueInYear;
import com.javamongo.moviebooktickets.dto.RevenueOfDays;
import com.javamongo.moviebooktickets.dto.RevenueRoom;
import com.javamongo.moviebooktickets.dto.StartEndDate;
import com.javamongo.moviebooktickets.dto.TicketDto;
import com.javamongo.moviebooktickets.entity.AppUser;
import com.javamongo.moviebooktickets.entity.ShowTime;
import com.javamongo.moviebooktickets.entity.Ticket;
import com.javamongo.moviebooktickets.repository.AppUserRepository;
import com.javamongo.moviebooktickets.repository.ShowTimeRepository;
import com.javamongo.moviebooktickets.repository.TicketRepository;
import java.time.temporal.ChronoUnit;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private ShowTimeRepository showTimeRepository;
    @Autowired
    private AppUserRepository userRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public MyResponse<Ticket> addTicket(TicketDto ticket) {

        MyResponse<Ticket> myResponse = new MyResponse<>();
        List<Ticket> tickets = ticketRepository.findByShowTimeId(ticket.getShowTimeId());
        // Kiểm tra ghế đã được đặt chưa
        for (String seat : ticket.getSeats()) {
            for (Ticket t : tickets) {
                // Kiểm tra kí tự đầu có từ A đến J hay không
                // Kiểm tra 2 kí tự sau có từ 00 đến 10 hay không
                if (seat.charAt(0) >= 'A' || seat.charAt(0) <= 'J') {
                    // lấy 2 kí tự sau chuyển thành kiểu int
                    int num = Integer.parseInt(seat.substring(1));
                    // so sánh với 10
                    if (num < 0 || num > 10) {
                        myResponse.setStatus(400);
                        myResponse.setMessage("Ghế " + seat + " không hợp lệ");
                        return myResponse;
                    } else {
                        if (t.getSeats().contains(seat)) {
                            myResponse.setStatus(400);
                            myResponse.setMessage("Ghế " + seat + " đã được đặt");
                            return myResponse;
                        }
                    }
                } else {
                    myResponse.setStatus(400);
                    myResponse.setMessage("Ghế " + seat + " không hợp lệ");
                    return myResponse;
                }
            }
        }
        // Kiểm tra suất chiếu đã được chiếu chưa
        ShowTime showTime = new ShowTime();
        Optional<ShowTime> showTimeOptional = showTimeRepository.findById(ticket.getShowTimeId());
        if (!showTimeOptional.isPresent()) {
            myResponse.setStatus(400);
            myResponse.setMessage("Không tìm thấy suất chiếu");
            return myResponse;
        } else {
            showTime = showTimeOptional.get();
            if (showTime.getShowTimeDate().isAfter(java.time.LocalDate.now())
                    || showTime.getShowTimeDate().isEqual(java.time.LocalDate.now())) {
                if (showTime.getStartTime().isBefore(java.time.LocalTime.now()) && showTime.getShowTimeDate()
                        .isEqual(java.time.LocalDate.now())) {
                    myResponse.setStatus(400);
                    myResponse.setMessage("Hết thời gian đặt vé cho suất chiếu này");
                    return myResponse;
                }
            } else {
                myResponse.setStatus(400);
                myResponse.setMessage("Hết thời gian đặt vé cho suất chiếu này");
                return myResponse;
            }
        }
        // Kiểm tra số lượng vé đặt không vượt quá số lượng ghế
        // if (ticket.getSeats().size() >
        // ticket.getShowTime().getRoom().getSeats().size()) {
        // myResponse.setStatus(400);
        // myResponse.setMessage("Số lượng vé đặt không được vượt quá số lượng ghế");
        // return myResponse;
        // }

        Ticket ticketCreate = new Ticket();

        // Trừ tiền trong tài khoản
        Optional<AppUser> user = userRepository.findByEmail(ticket.getEmail());
        if (user.isPresent()) {
            if (user.get().getAccountBalance() < ticket.getSeats().size() * showTime.getPrice()) {
                myResponse.setStatus(400);
                myResponse.setMessage("Số dư không đủ");
                return myResponse;
            }
            user.get()
                    .setAccountBalance(user.get().getAccountBalance() - ticket.getSeats().size() * showTime.getPrice());
            userRepository.save(user.get());
        } else {
            myResponse.setStatus(400);
            myResponse.setMessage("Không tìm thấy người dùng");
            return myResponse;
        }

        ticketCreate.setSeats(ticket.getSeats());
        ticketCreate.setShowTime(showTime);
        ticketCreate.setBookingDate(java.util.Date.from(java.time.Instant.now()));
        ticketCreate.setEmail(ticket.getEmail().toLowerCase());
        ticketCreate.setTotalPrice(ticket.getSeats().size() * showTime.getPrice());
        myResponse.setStatus(200);
        myResponse.setMessage("Đặt vé thành công");
        Ticket ticketCreated = ticketRepository.save(ticketCreate);
        ticketCreate.setId(ticketCreated != null ? ticketCreated.getId() : "TicketId");
        myResponse.setData(ticketCreate);
        return myResponse;
    }

    public MyResponse<List<Ticket>> getAllTickets(String email) {
        MyResponse<List<Ticket>> myResponse = new MyResponse<>();
        List<Ticket> tickets = ticketRepository.findByEmail(email);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thông tin vé thành công");
        myResponse.setData(tickets);
        return myResponse;
    }

    // Kiểm tra ghế đã được đặt chưa
    public MyResponse<?> checkSeat(String showTimeId, String seat) {
        MyResponse<?> myResponse = new MyResponse<>();
        List<Ticket> tickets = ticketRepository.findByShowTimeId(showTimeId);
        for (Ticket ticket : tickets) {
            if (ticket.getSeats().contains(seat)) {
                myResponse.setStatus(400);
                myResponse.setMessage("Ghế" + seat + " đã được đặt");
                return myResponse;
            }
        }
        myResponse.setStatus(200);
        myResponse.setMessage("Ghế chưa được đặt");
        return myResponse;
    }

    // Hủy vé
    public MyResponse<Double> cancelTicket(String id, String email) {
        MyResponse<Double> myResponse = new MyResponse<>();
        Optional<Ticket> ticket = ticketRepository.findById(id);

        if (email.length() < 1) {
            myResponse.setStatus(400);
            myResponse.setMessage("Bạn chưa đăng nhập");
            return myResponse;
        }

        if (ticket.isPresent()) {
            ShowTime showTime = showTimeRepository.findById(ticket.get().getShowTime().getId()).get();
            if (showTime.getShowTimeDate().isBefore(java.time.LocalDate.now())) {
                myResponse.setStatus(400);
                myResponse.setMessage("Hết thời gian hủy vé");
                return myResponse;
            } else {
                if (showTime.getShowTimeDate().minusDays(1).isBefore(java.time.LocalDate.now())) {
                    myResponse.setStatus(400);
                    myResponse.setMessage("Hết thời gian hủy vé");
                    return myResponse;
                }
            }
        } else {
            myResponse.setStatus(400);
            myResponse.setMessage("Không tìm thấy vé");
            return myResponse;
        }

        // Kiểm tra quyền hủy
        if (!ticket.get().getEmail().equals(email)) {
            myResponse.setStatus(400);
            myResponse.setMessage("Không có quyền hủy vé");
            return myResponse;
        }

        // Chỉ được hủy khi thời gian hủy trước thời gian chiếu là 2 tiếng
        if (ticket.isPresent()) {
            ShowTime showTime = showTimeRepository.findById(ticket.get().getShowTime().getId()).get();
            if (showTime.getShowTimeDate().isEqual(java.time.LocalDate.now())) {
                if (showTime.getStartTime().minusHours(2).isBefore(java.time.LocalTime.now())) {
                    myResponse.setStatus(400);
                    myResponse.setMessage("Hết thời gian hủy vé");
                    return myResponse;
                }
            }
        }

        if (ticket.isPresent()) {
            double refund = 0;
            // Trả lại 50% tiền
            Optional<AppUser> user = userRepository.findByEmail(ticket.get().getEmail());
            if (user.isPresent()) {
                refund = (ticket.get().getSeats().size() * ticket.get().getShowTime().getPrice()) / 2;
                user.get().setAccountBalance(user.get().getAccountBalance() + refund);
                userRepository.save(user.get());
            } else {
                myResponse.setStatus(400);
                myResponse.setMessage("Không tìm thấy người dùng");
                return myResponse;
            }
            ticketRepository.deleteById(id);
            myResponse.setStatus(200);
            myResponse.setMessage("Hủy vé thành công, số tiền hoàn lại: "
                    + refund);
            myResponse.setData(refund);
            return myResponse;
        } else {
            myResponse.setStatus(400);
            myResponse.setMessage("Không tìm thấy vé");
            return myResponse;
        }
    }
    // Đếm số ghế đã đặt
    // public int countSeat(String showTimeId) {
    // List<Ticket> tickets = ticketRepository.findByShowTimeId(showTimeId);
    // int count = 0;
    // for (Ticket ticket : tickets) {
    // count += ticket.getSeats().size();
    // }
    // return count;
    // }

    public MyResponse<RevenueOfDays> getRevenue(int n) {
        MyResponse<RevenueOfDays> myResponse = new MyResponse<>();

        Aggregation aggregation = Aggregation.newAggregation(
                // $match: {
                // "bookingDate": {
                // $gte: pastDate, // Lọc các vé đã đặt trong n ngày gần nhất
                // }
                // }
                Aggregation.match(Criteria.where("bookingDate").gte(java.time.Instant.now().minus(n, ChronoUnit.DAYS))),
                Aggregation.unwind("seats"),
                // $group: {
                // _id: "$showTime.movie._id", // Nhóm theo ID của phim
                // movieName: { $first: "$showTime.movie.name" }, // Lấy tên phim
                // totalRevenue: { $sum: "$showTime.price" } // Tính tổng doanh thu cho phim
                // }

                Aggregation.group("showTime.movie._id")
                        .first("showTime.movie.name").as("movieName")
                        .sum("showTime.price").as("totalRevenue"),
                // $group: {
                // _id: null, // Nhóm lại để tính tổng doanh thu cho tất cả các phim
                // totalRevenueAll: { $sum: "$totalRevenue" } // Cộng tổng doanh thu của tất cả
                // các phim
                // }
                Aggregation.group().sum("totalRevenue").as("totalRevenueAll"),
                // $project: {
                // _id: 0, // Ẩn trường _id
                // totalRevenueAll: 1 // Chỉ hiển thị tổng doanh thu
                // }
                Aggregation.project().andExclude("_id").andInclude("totalRevenueAll"));

        AggregationResults<RevenueOfDays> results = mongoTemplate.aggregate(aggregation, "tickets",
                RevenueOfDays.class);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy doanh thu thành công");
        myResponse.setData(results.getUniqueMappedResult());
        return myResponse;
    }

    public MyResponse<MostBookedCustomers> getMostCustomer() {
        MyResponse<MostBookedCustomers> myResponse = new MyResponse<>();
        Aggregation aggregation = Aggregation.newAggregation(
                // $group: {
                // _id: "$email", // Nhóm theo email
                // totalTickets: { $sum: 1 } // Đếm số vé đã đặt của mỗi email
                // }
                Aggregation.group("email").count().as("totalTickets"),
                // {
                // $sort: { totalTickets: -1 } // Sắp xếp theo số vé đã đặt (giảm dần)
                // },
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "totalTickets")),
                Aggregation.limit(1),
                // $project: {
                // _id: 0, // Ẩn trường _id
                // email: "$_id", // Hiển thị email
                // totalTickets: 1 // Hiển thị tổng số vé đã đặt
                // }
                Aggregation.project()
                        .andExclude("_id") // Loại bỏ trường _id gốc
                        .and("_id").as("email") // Đổi trường _id thành email
                        .andInclude("totalTickets") // Giữ lại trường totalTickets
        );
        AggregationResults<MostBookedCustomers> results = mongoTemplate.aggregate(aggregation, "tickets",
                MostBookedCustomers.class);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thông tin thành công");
        myResponse.setData(results.getUniqueMappedResult());
        return myResponse;
    }

    public MyResponse<List<MovieTickets>> getMostMovie() {
        MyResponse<List<MovieTickets>> myResponse = new MyResponse<>();
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("showTime.movie.name").count().as("totalTickets"));
        AggregationResults<MovieTickets> results = mongoTemplate
                .aggregate(aggregation, "tickets", MovieTickets.class);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thông tin thành công");
        myResponse.setData(results.getMappedResults());
        return myResponse;
    }

    public MyResponse<MovieTickets> getTotalTicket(StartEndDate date) {
        MyResponse<MovieTickets> myResponse = new MyResponse<>();
        // Date startDate = Date.from(Instant.parse("2024-10-01T00:00:00Z"));
        // Date endDate = Date.from(Instant.parse("2024-12-31T23:59:59Z"));
        // Aggregation aggregation = Aggregation.newAggregation(
        // Aggregation.match(
        // Criteria.where("bookingDate").gte(startDate).lte(endDate)),
        // Aggregation.group()
        // .sum(Aggregation.sizeOf("seats")).as("totalTickets"),
        // Aggregation.project()
        // .andExclude("_id")
        // .and("totalTickets").as("totalTickets"));
        // Aggregation aggregation = Aggregation.newAggregation(
        // $match: {
        // bookingDate: {
        // $gte: ISODate("2024-10-01T00:00:00Z"),
        // $lte: ISODate("2024-12-31T23:59:59Z")
        // }
        // }

        // Aggregation.match(Criteria.where("bookingDate").gte(date.getStartDate()).lte(date.getEndDate())),
        // $group: {
        // _id: null,
        // totalTickets: { $sum: { $size: "$seats" } }
        // }
        // Aggregation.group().sum("seats").as("totalTickets"),
        // $project: {
        // _id: 0,
        // totalTickets: 1 // Hiển thị tổng số vé đã bán
        // }
        // Aggregation.project().andExclude("_id").andInclude("totalTickets"));
        // AggregationResults<MovieTickets> results =
        // mongoTemplate.aggregate(aggregation, "tickets", MovieTickets.class);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thông tin thành công");
        // myResponse.setData(results.getUniqueMappedResult());
        return myResponse;
    }

    public MyResponse<?> checkTicket(String ticketId) {
        MyResponse<?> myResponse = new MyResponse<>();
        Optional<Ticket> ticket = ticketRepository.findById(ticketId);
        if (ticket.isPresent()) {
            ShowTime showTime = showTimeRepository.findById(ticket.get().getShowTime().getId()).get();
            if (showTime.getShowTimeDate().isEqual(java.time.LocalDate.now())) {
                if (showTime.getStartTime().isBefore(java.time.LocalTime.now())) {
                    myResponse.setStatus(400);
                    myResponse.setMessage("Vé không hợp lệ");
                    return myResponse;
                }
            }
        }
        if (ticket.isPresent()) {
            ShowTime showTime = showTimeRepository.findById(ticket.get().getShowTime().getId()).get();
            if (showTime.getShowTimeDate().isBefore(java.time.LocalDate.now())) {
                myResponse.setStatus(400);
                myResponse.setMessage("Vé không hợp lệ");
                return myResponse;
            } else {
                if (showTime.getShowTimeDate().minusDays(1).isBefore(java.time.LocalDate.now())) {
                    myResponse.setStatus(400);
                    myResponse.setMessage("Vé không hợp lệ");
                    return myResponse;
                }
            }
        } else {
            myResponse.setStatus(400);
            myResponse.setMessage("Không tìm thấy vé");
            return myResponse;
        }
        myResponse.setStatus(200);
        myResponse.setMessage("Vé hợp lệ");
        return myResponse;
    }

    public MyResponse<Ticket> getTicket(String ticketId) {
        MyResponse<Ticket> myResponse = new MyResponse<>();
        Optional<Ticket> ticket = ticketRepository.findById(ticketId);
        if (ticket.isPresent()) {
            myResponse.setStatus(200);
            myResponse.setMessage("Lấy thông tin vé thành công");
            myResponse.setData(ticket.get());
            return myResponse;
        } else {
            myResponse.setStatus(400);
            myResponse.setMessage("Không tìm thấy vé");
            return myResponse;
        }
    }

    public MyResponse<List<RevenueRoom>> getRevenueRoom() {
        MyResponse<List<RevenueRoom>> myResponse = new MyResponse<>();
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("showTime.roomId") // Nhóm theo roomId
                        .sum("showTime.price").as("totalRevenue"));
        AggregationResults<RevenueRoom> results = mongoTemplate.aggregate(aggregation, "tickets", RevenueRoom.class);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thông tin thành công");
        myResponse.setData(results.getMappedResults());
        return myResponse;
    }

    @SuppressWarnings("deprecation")
    public MyResponse<List<RevenueInYear>> getRevenueYear() {
        MyResponse<List<RevenueInYear>> myResponse = new MyResponse<>();

        Date twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        Aggregation aggregation = Aggregation.newAggregation(
                // Lọc theo thời gian
                Aggregation.match(Criteria.where("showTime.showTimeDate")
                        .gte(twelveMonthsAgo)),
                // Dự báo dữ liệu
                Aggregation.project()
                        .andExpression("year(showTime.showTimeDate)").as("year")
                        .andExpression("month(showTime.showTimeDate)").as("month")
                        .and("showTime.price").as("price"),
                // Nhóm theo năm và tháng
                Aggregation.group("year", "month")
                        .sum("price").as("totalRevenue"),
                // Lọc ra những tháng có totalRevenue > 0
                // Aggregation.match(Criteria.where("totalRevenue").gt(0)),
                // Sắp xếp kết quả
                Aggregation.sort(Sort.by(Sort.Order.asc("_id.year"), Sort.Order.asc("_id.month"))));
        AggregationResults<RevenueInYear> results = mongoTemplate.aggregate(aggregation, "tickets",
                RevenueInYear.class);
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thông tin thành công");
        myResponse.setData(results.getMappedResults());
        return myResponse;
    }
}
