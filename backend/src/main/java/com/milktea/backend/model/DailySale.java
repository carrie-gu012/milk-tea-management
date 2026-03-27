package com.milktea.backend.model;

import java.time.LocalDate;

public class DailySale {
    private LocalDate saleDate;
    private Integer totalCents;

    public DailySale() {}

    public DailySale(LocalDate saleDate, Integer totalCents) {
        this.saleDate = saleDate;
        this.totalCents = totalCents;
    }

    public LocalDate getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDate saleDate) { this.saleDate = saleDate; }

    public Integer getTotalCents() { return totalCents; }
    public void setTotalCents(Integer totalCents) { this.totalCents = totalCents; }
}
