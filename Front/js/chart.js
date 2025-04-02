// DOM Elements
const totalUsersEl = document.getElementById('totalUsers');
const totalCategoriesEl = document.getElementById('totalCategories');
const totalProductsEl = document.getElementById('totalProducts');
const totalRevenueEl = document.getElementById('totalRevenue');
const monthPicker = document.getElementById('monthPicker');
const fetchRevenueByMonthBtn = document.getElementById('fetchRevenueByMonth');
const selectedMonthRevenueEl = document.getElementById('selectedMonthRevenue');
const lineChartTitle = document.querySelector('#linechart').parentElement.querySelector('h2');
const doughnutChartTitle = document.querySelector('#doughnut').parentElement.querySelector('h2');

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api/orders';

// Biến để lưu trữ biểu đồ (để hủy và vẽ lại)
let lineChartInstance = null;
let doughnutChartInstance = null;

// Lấy dữ liệu thống kê tổng quan
async function fetchStatisticsOverview() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics/overview`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dữ liệu thống kê:', data);
        totalUsersEl.textContent = data.totalUsers || 0;
        totalCategoriesEl.textContent = data.totalCategories || 0;
        totalProductsEl.textContent = data.totalProducts || 0;
        totalRevenueEl.textContent = data.totalRevenue ? Number(data.totalRevenue).toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ';
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
    }
}

// Lấy dữ liệu doanh thu 12 tháng qua và vẽ biểu đồ đường
async function fetchRevenueChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics/revenue`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dữ liệu doanh thu 12 tháng:', data);

        const labels = Object.keys(data);
        const values = Object.values(data);

        // Hủy biểu đồ cũ nếu tồn tại
        if (lineChartInstance) {
            lineChartInstance.destroy();
        }

        const ctx = document.getElementById('linechart').getContext('2d');
        lineChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return Number(value).toLocaleString('vi-VN') + ' VNĐ';
                            }
                        }
                    }
                }
            }
        });

        // Cập nhật tiêu đề
        lineChartTitle.textContent = 'Doanh thu (12 tháng qua)';
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu:', error);
    }
}

// Lấy dữ liệu doanh thu theo từng ngày trong tháng và vẽ biểu đồ đường
async function fetchRevenueByDayInMonth(month) {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics/revenue/days?month=${month}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Doanh thu theo ngày trong tháng ${month}:`, data);

        const labels = Object.keys(data).map(date => date.split('-')[2]); // Chỉ lấy ngày (dd)
        const values = Object.values(data);

        // Hủy biểu đồ cũ nếu tồn tại
        if (lineChartInstance) {
            lineChartInstance.destroy();
        }

        const ctx = document.getElementById('linechart').getContext('2d');
        lineChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return Number(value).toLocaleString('vi-VN') + ' VNĐ';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Ngày'
                        }
                    }
                }
            }
        });

        // Cập nhật tiêu đề
        lineChartTitle.textContent = `Doanh thu theo ngày trong tháng ${month}`;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu theo ngày:', error);
    }
}

// Lấy dữ liệu phân bố người dùng và vẽ biểu đồ tròn
async function fetchUserDistributionChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics/users`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dữ liệu phân bố người dùng:', data);

        const labels = Object.keys(data);
        const values = Object.values(data);

        // Hủy biểu đồ cũ nếu tồn tại
        if (doughnutChartInstance) {
            doughnutChartInstance.destroy();
        }

        const ct = document.getElementById('doughnut').getContext('2d');
        doughnutChartInstance = new Chart(ct, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Số lượng người dùng',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });

        // Cập nhật tiêu đề
        doughnutChartTitle.textContent = 'Phân bố người dùng';
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phân bố người dùng:', error);
    }
}

// Lấy dữ liệu phân bố người dùng trong tháng được chọn và vẽ biểu đồ tròn
async function fetchUserDistributionByMonth(month) {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics/users/month?month=${month}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Phân bố người dùng trong tháng ${month}:`, data);

        const labels = Object.keys(data);
        const values = Object.values(data);

        // Hủy biểu đồ cũ nếu tồn tại
        if (doughnutChartInstance) {
            doughnutChartInstance.destroy();
        }

        const ct = document.getElementById('doughnut').getContext('2d');
        doughnutChartInstance = new Chart(ct, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Số lượng người dùng',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });

        // Cập nhật tiêu đề
        doughnutChartTitle.textContent = `Phân bố người dùng trong tháng ${month}`;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phân bố người dùng theo tháng:', error);
    }
}

// Lấy doanh thu theo tháng được chọn và cập nhật biểu đồ
async function fetchRevenueByMonth() {
    const selectedMonth = monthPicker.value; // Giá trị dạng yyyy-MM
    if (!selectedMonth) {
        alert('Vui lòng chọn một tháng!');
        return;
    }

    try {
        // Lấy tổng doanh thu của tháng
        const revenueResponse = await fetch(`${API_BASE_URL}/statistics/revenue/month?month=${selectedMonth}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!revenueResponse.ok) {
            throw new Error(`HTTP error! status: ${revenueResponse.status}`);
        }
        const revenue = await revenueResponse.json();
        console.log(`Doanh thu tháng ${selectedMonth}:`, revenue);
        selectedMonthRevenueEl.textContent = revenue ? Number(revenue).toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ';

        // Cập nhật biểu đồ doanh thu theo ngày
        await fetchRevenueByDayInMonth(selectedMonth);

        // Cập nhật biểu đồ phân bố người dùng trong tháng
        await fetchUserDistributionByMonth(selectedMonth);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu theo tháng:', error);
        selectedMonthRevenueEl.textContent = '0 VNĐ';
    }
}

// Khởi chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    fetchStatisticsOverview();
    fetchRevenueChart();
    fetchUserDistributionChart();

    // Gán sự kiện cho nút "Xem doanh thu"
    fetchRevenueByMonthBtn.addEventListener('click', fetchRevenueByMonth);
});