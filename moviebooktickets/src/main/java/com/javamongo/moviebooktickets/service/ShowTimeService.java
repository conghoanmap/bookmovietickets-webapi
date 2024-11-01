package com.javamongo.moviebooktickets.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.javamongo.moviebooktickets.dto.BookedSeats;
import com.javamongo.moviebooktickets.dto.MyResponse;
import com.javamongo.moviebooktickets.dto.ShowTimeDto;
import com.javamongo.moviebooktickets.entity.Movie;
import com.javamongo.moviebooktickets.entity.ShowTime;
import com.javamongo.moviebooktickets.repository.MovieRepository;
import com.javamongo.moviebooktickets.repository.ShowTimeRepository;

@Service
public class ShowTimeService {

    @Autowired
    private ShowTimeRepository showTimeRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public MyResponse<ShowTime> addShowTime(ShowTimeDto showTime) {
        MyResponse<ShowTime> myResponse = new MyResponse<>();
        // Kiểm tra ngày chiếu phải lớn hơn hoặc bằng ngày hiện tại
        if (showTime.getShowTimeDate().isBefore(LocalDate.now())) {
            myResponse.setStatus(400);
            myResponse.setMessage("Ngày chiếu phải lớn hơn hoặc bằng ngày hiện tại");
            return myResponse;
        }
        // Kiểm tra giờ bắt đầu phải lớn hơn giờ hiện tại
        if (showTime.getShowTimeDate().isEqual(LocalDate.now())
                && showTime.getStartTime().isBefore(java.time.LocalTime.now())) {
            myResponse.setStatus(400);
            myResponse.setMessage("Giờ bắt đầu phải lớn hơn giờ hiện tại");
            return myResponse;
        }
        // Kiểm tra phim có tồn tại không
        Movie movie = movieRepository.findById(showTime.getMovieId()).orElse(null);
        if (movie == null) {
            myResponse.setStatus(404);
            myResponse.setMessage("Không tìm thấy phim");
            return myResponse;
        }
        // Kiểm tra giờ chiếu không được trùng ngày giờ với các showtime khác

        // Lọc các showtime có ngày và phòng chiếu giống với showtime mới thêm
        List<ShowTime> showTimes = showTimeRepository.findAll().stream()
                .filter(s -> s.getShowTimeDate().equals(showTime.getShowTimeDate()))
                .filter(s -> s.getRoomId().equals(showTime.getRoomId()))
                .collect(Collectors.toList());
        if (showTimes.size() > 0) {
            LocalTime sStartTime = showTime.getStartTime(); // Giờ bắt đầu
            LocalTime sEndTime = showTime.getStartTime().plusMinutes(movie.getDuration()); // Giờ kết thúc

            for (ShowTime s : showTimes) {
                LocalTime startTime = s.getStartTime(); // Giờ bắt đầu
                LocalTime endTime = s.getStartTime().plusMinutes(s.getMovie().getDuration()); // Giờ kết thúc
                boolean condition1 = (sStartTime.equals(startTime) || sStartTime.isAfter(startTime))
                        && (sStartTime.equals(endTime) || sStartTime.isBefore(endTime));
                boolean condition2 = (sEndTime.equals(startTime) || sEndTime.isAfter(startTime))
                        && (sEndTime.isBefore(endTime) || sEndTime.isBefore(endTime));

                // LocalTime a = LocalTime.of(19, 30);
                // LocalTime b = LocalTime.of(19, 40);
                // boolean condition3 = b.isAfter(a);

                if (condition1 || condition2) {
                    myResponse.setStatus(400);
                    myResponse.setMessage("Suất chiếu này có thể bị tràn sang suất chiếu: " + s.getId());
                    return myResponse;
                }
            }
        }
        // Giá vé phải lớn hơn 0 và phải là bội số của 5000
        if (showTime.getPrice() <= 0 || showTime.getPrice() % 5000 != 0) {
            myResponse.setStatus(400);
            myResponse.setMessage("Giá vé phải lớn hơn 0 và phải là bội số của 5000");
            return myResponse;
        }
        ShowTime showTimeEntity = new ShowTime();
        showTimeEntity.setShowTimeDate(showTime.getShowTimeDate());
        showTimeEntity.setStartTime(showTime.getStartTime());
        showTimeEntity.setPrice(showTime.getPrice());
        showTimeEntity.setRoomId(showTime.getRoomId());
        showTimeEntity.setMovie(movie);

        myResponse.setStatus(200);
        myResponse.setMessage("Thêm showtime thành công");
        myResponse.setData(showTimeRepository.save(showTimeEntity));
        return myResponse;
    }

    public MyResponse<List<ShowTime>> getAllShowTime(LocalDate showTimeDate, String roomId) {
        MyResponse<List<ShowTime>> myResponse = new MyResponse<>();
        // Lọc các showtime có ngày chiếu bắt đầu từ hôm nay trở đi
        List<ShowTime> showTimes = showTimeRepository.findAll().stream()
                .filter(s -> s.getShowTimeDate().isAfter(LocalDate.now()/* .minusDays(1) */)
                        || s.getShowTimeDate().isEqual(LocalDate.now()))
                .collect(Collectors.toList());
        if (showTimeDate != null) {
            showTimes = showTimes.stream()
                    .filter(s -> s.getShowTimeDate().equals(showTimeDate))
                    .collect(Collectors.toList());
            // for (ShowTime item : showTimes) {
            // if (!item.getShowTimeDate().equals(showTimeDate)) {
            // showTimes.remove(item);
            // }
            // }
        }
        if (roomId.length() > 0) {
            showTimes = showTimes.stream()
                    .filter(s -> s.getRoomId().equals(roomId))
                    .collect(Collectors.toList());
        }
        // Sort theo giờ bắt đầu
        showTimes.sort((s1, s2) -> s1.getStartTime().compareTo(s2.getStartTime()));
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thông tin suất chiếu thành công");
        myResponse.setData(showTimes);
        return myResponse;
    }

    public MyResponse<BookedSeats> getBookedSeats(String showTimeId) {
        MyResponse<BookedSeats> myResponse = new MyResponse<>();
        Aggregation aggregation = Aggregation.newAggregation(
                // {
                // $match: { "showTime._id": ObjectId("6700b715934b55668a958e95") } // ID của
                // suất chiếu cần tìm
                // },
                Aggregation.match(Criteria.where("showTime._id").is(new ObjectId(showTimeId))),
                // {
                // $project: { seats: 1, _id: 0 } // Chỉ lấy trường seats
                // },
                Aggregation.project().and("seats").as("seats").andExclude("_id"),
                // {
                // $unwind: "$seats" // Tách từng ghế ra thành các tài liệu riêng biệt
                // },
                Aggregation.unwind("seats"),
                // {
                // $group: {
                // _id: null, // Gộp tất cả lại
                // allSeats: { $addToSet: "$seats" } // Tạo một mảng chứa tất cả ghế
                // }
                // },
                Aggregation.group().addToSet("seats").as("allSeats"),
                // $project: {
                // _id: 0, // Không lấy trường _id
                // allSeats: 1 // Chỉ lấy mảng allSeats
                // }
                Aggregation.project().andExclude("_id").andInclude("allSeats"));
        AggregationResults<BookedSeats> results = mongoTemplate.aggregate(aggregation, "tickets", BookedSeats.class);
                myResponse.setStatus(200);
        myResponse.setMessage("Lấy danh sách ghế đã đặt thành công");
        myResponse.setData(results.getUniqueMappedResult());
        return myResponse;
    }

    public MyResponse<ShowTime> getShowTimeById(String showTimeId) {
        MyResponse<ShowTime> myResponse = new MyResponse<>();
        ShowTime showTime = showTimeRepository.findById(showTimeId).orElse(null);
        if (showTime == null) {
            myResponse.setStatus(404);
            myResponse.setMessage("Không tìm thấy suất chiếu");
            return myResponse;
        }
        myResponse.setStatus(200);
        myResponse.setMessage("Lấy thông tin suất chiếu thành công");
        myResponse.setData(showTime);
        return myResponse;
    }

}
