package com.webdigital.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.webdigital.DAO.OrderRepository;
import com.webdigital.DAO.ProductRepository;
import com.webdigital.DAO.UserRepository;
import com.webdigital.Model.Order;

@Service
public class StatisticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Lấy dữ liệu thống kê tổng quan
    public Map<String, Object> getStatisticsOverview() {
        Map<String, Object> overview = new HashMap<>();

        // Tổng số người dùng
        long totalUsers = userRepository.count();
        overview.put("totalUsers", totalUsers);

        // Tổng số danh mục (giả định bạn có entity Category)
        overview.put("totalCategories", 10); // Giả lập

        // Tổng số sản phẩm
        long totalProducts = productRepository.count();
        overview.put("totalProducts", totalProducts);

        // Tổng doanh thu
        List<Order> completedOrders = orderRepository.findAll().stream()
            .filter(order -> "Completed".equals(order.getStatus()))
            .collect(Collectors.toList());
        System.out.println("Số đơn hàng Completed: " + completedOrders.size());
        double totalRevenue = completedOrders.stream()
            .mapToDouble(order -> Optional.ofNullable(order.getTotalAmount())
                .map(BigDecimal::doubleValue)
                .orElse(0.0))
            .sum();
        System.out.println("Tổng doanh thu: " + totalRevenue);
        overview.put("totalRevenue", totalRevenue);

        return overview;
    }

    // Lấy doanh thu 12 tháng qua
    public Map<String, Double> getRevenueLast12Months() {
        Map<String, Double> revenueByMonth = new HashMap<>();
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        // Khởi tạo doanh thu cho 12 tháng (bằng 0)
        for (int i = 11; i >= 0; i--) {
            String month = now.minusMonths(i).format(formatter);
            revenueByMonth.put(month, 0.0);
        }

        // Tính doanh thu từ các đơn hàng đã hoàn thành
        List<Order> orders = orderRepository.findAll();
        for (Order order : orders) {
            if ("Completed".equals(order.getStatus()) && order.getOrderDate() != null) {
                String month = order.getOrderDate().toLocalDate().format(formatter);
                if (revenueByMonth.containsKey(month)) {
                    double currentRevenue = revenueByMonth.get(month);
                    double orderRevenue = Optional.ofNullable(order.getTotalAmount())
                        .map(BigDecimal::doubleValue)
                        .orElse(0.0);
                    revenueByMonth.put(month, currentRevenue + orderRevenue);
                }
            }
        }

        System.out.println("Doanh thu 12 tháng: " + revenueByMonth);
        return revenueByMonth;
    }

    // Lấy doanh thu theo từng ngày trong tháng được chọn
    public Map<String, Double> getRevenueByDayInMonth(String month) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate selectedMonth;
        try {
            selectedMonth = LocalDate.parse(month + "-01", DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (Exception e) {
            throw new IllegalArgumentException("Định dạng tháng không hợp lệ. Vui lòng sử dụng định dạng yyyy-MM.");
        }

        // Tính số ngày trong tháng
        int daysInMonth = selectedMonth.lengthOfMonth();
        Map<String, Double> revenueByDay = new HashMap<>();

        // Khởi tạo doanh thu cho từng ngày (bằng 0)
        for (int day = 1; day <= daysInMonth; day++) {
            String dayKey = selectedMonth.withDayOfMonth(day).format(dayFormatter);
            revenueByDay.put(dayKey, 0.0);
        }

        // Tính doanh thu từ các đơn hàng trong tháng
        List<Order> orders = orderRepository.findAll();
        for (Order order : orders) {
            if ("Completed".equals(order.getStatus()) && order.getOrderDate() != null) {
                String orderMonth = order.getOrderDate().toLocalDate().format(formatter);
                if (month.equals(orderMonth)) {
                    String dayKey = order.getOrderDate().toLocalDate().format(dayFormatter);
                    double currentRevenue = revenueByDay.getOrDefault(dayKey, 0.0);
                    double orderRevenue = Optional.ofNullable(order.getTotalAmount())
                        .map(BigDecimal::doubleValue)
                        .orElse(0.0);
                    revenueByDay.put(dayKey, currentRevenue + orderRevenue);
                }
            }
        }

        System.out.println("Doanh thu theo ngày trong tháng " + month + ": " + revenueByDay);
        return revenueByDay;
    }

    // Lấy phân bố người dùng trong tháng được chọn
    public Map<String, Integer> getUserDistributionByMonth(String month) {
        Map<String, Integer> userDistribution = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        // Khởi tạo các trạng thái
        userDistribution.put("Thành công", 0);
        userDistribution.put("Không thành công", 0);
        userDistribution.put("Chờ xác nhận", 0);
        userDistribution.put("Đang thực hiện", 0);

        // Lấy danh sách đơn hàng trong tháng
        List<Order> orders = orderRepository.findAll();
        Map<Long, String> userStatus = new HashMap<>();

        for (Order order : orders) {
            if (order.getOrderDate() != null && order.getUser() != null && order.getStatus() != null) {
                String orderMonth = order.getOrderDate().toLocalDate().format(formatter);
                if (month.equals(orderMonth)) {
                    Long userId = order.getUser().getUserID();
                    String status = order.getStatus();
                    userStatus.put(userId, status);
                }
            }
        }

        // Đếm số lượng người dùng theo trạng thái
        for (String status : userStatus.values()) {
            switch (status) {
                case "Completed":
                    userDistribution.put("Thành công", userDistribution.get("Thành công") + 1);
                    break;
                case "Cancelled":
                    userDistribution.put("Không thành công", userDistribution.get("Không thành công") + 1);
                    break;
                case "Pending":
                    userDistribution.put("Chờ xác nhận", userDistribution.get("Chờ xác nhận") + 1);
                    break;
                case "Processing":
                    userDistribution.put("Đang thực hiện", userDistribution.get("Đang thực hiện") + 1);
                    break;
                default:
                    break;
            }
        }

        System.out.println("Phân bố người dùng trong tháng " + month + ": " + userDistribution);
        return userDistribution;
    }

    // Lấy phân bố người dùng (tổng thể)
    public Map<String, Integer> getUserDistribution() {
        Map<String, Integer> userDistribution = new HashMap<>();

        // Khởi tạo các trạng thái
        userDistribution.put("Thành công", 0);
        userDistribution.put("Không thành công", 0);
        userDistribution.put("Chờ xác nhận", 0);
        userDistribution.put("Đang thực hiện", 0);

        // Lấy danh sách đơn hàng
        List<Order> orders = orderRepository.findAll();
        Map<Long, String> userStatus = new HashMap<>();

        // Phân loại người dùng dựa trên trạng thái đơn hàng
        for (Order order : orders) {
            if (order.getUser() != null && order.getStatus() != null) {
                Long userId = order.getUser().getUserID();
                String status = order.getStatus();
                userStatus.put(userId, status);
            }
        }

        // Đếm số lượng người dùng theo trạng thái
        for (String status : userStatus.values()) {
            switch (status) {
                case "Completed":
                    userDistribution.put("Thành công", userDistribution.get("Thành công") + 1);
                    break;
                case "Cancelled":
                    userDistribution.put("Không thành công", userDistribution.get("Không thành công") + 1);
                    break;
                case "Pending":
                    userDistribution.put("Chờ xác nhận", userDistribution.get("Chờ xác nhận") + 1);
                    break;
                case "Processing":
                    userDistribution.put("Đang thực hiện", userDistribution.get("Đang thực hiện") + 1);
                    break;
                default:
                    break;
            }
        }

        return userDistribution;
    }

    // Lấy doanh thu theo tháng được chọn
    public double getRevenueByMonth(String month) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        LocalDate selectedMonth;
        try {
            selectedMonth = LocalDate.parse(month + "-01", DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (Exception e) {
            throw new IllegalArgumentException("Định dạng tháng không hợp lệ. Vui lòng sử dụng định dạng yyyy-MM.");
        }

        double revenue = orderRepository.findAll().stream()
            .filter(order -> "Completed".equals(order.getStatus()) && order.getOrderDate() != null)
            .filter(order -> order.getOrderDate().toLocalDate().format(formatter).equals(month))
            .mapToDouble(order -> Optional.ofNullable(order.getTotalAmount())
                .map(BigDecimal::doubleValue)
                .orElse(0.0))
            .sum();

        System.out.println("Doanh thu tháng " + month + ": " + revenue);
        return revenue;
    }
}