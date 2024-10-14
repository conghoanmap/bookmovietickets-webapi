package com.javamongo.moviebooktickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueInYear {
    private Id _id;
    private int totalRevenue;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Id {
        private int year;
        private int month;
    }
}
