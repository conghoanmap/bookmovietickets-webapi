package com.javamongo.moviebooktickets.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class BookedSeats {
    private List<String> allSeats;
}
