import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-bookings')
  async getRecentBookings(@Query('limit') limit = 10) {
    return this.dashboardService.getRecentBookings(+limit);
  }
}
