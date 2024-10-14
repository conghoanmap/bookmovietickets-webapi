package com.javamongo.moviebooktickets.dto;

import java.util.List;

import com.javamongo.moviebooktickets.entity.ShowTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowTimeMovie2 {
    private String _id;
    private List<ShowTime> showtimes;
}