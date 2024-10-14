package com.javamongo.moviebooktickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueRoom {
    private String _id;
    private int totalRevenue;
}
