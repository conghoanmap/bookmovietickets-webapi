package com.javamongo.moviebooktickets.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartEndDate {
    private LocalDate startDate;
    private LocalDate endDate;
}
