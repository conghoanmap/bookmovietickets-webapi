package com.javamongo.moviebooktickets.entity;

import java.util.Date;
import java.util.List;

import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Document(collection = "movies")
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    @Id
    private String id; // Mã phim
    @NotBlank(message = "Tên phim không được để trống")
    private String name; // Tên phim
    @NotBlank(message = "Mô tả không được để trống")
    private String description; // Mô tả
    @Min(value = 1, message = "Thời lượng phim phải lớn hơn 0")
    private int duration; // Thời lượng
    private List<String> languages; // Ngôn ngữ
    private Date releaseDate; // Ngày công chiếu
    @URL(message = "Link ảnh không hợp lệ")
    private String poster; // Ảnh poster
    @URL(message = "Link trailer không hợp lệ")
    private String trailer; // Link trailer (frame youtube)
    private List<String> categories; // Nhúng danh sách thể loại
}
