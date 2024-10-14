package com.javamongo.moviebooktickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

import com.javamongo.moviebooktickets.entity.ShowTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowTimeMovie {
    private String id;
    private List<ShowTime> showTimes;
}
