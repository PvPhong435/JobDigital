// DOM Elements
const orderTableBody = document.getElementById('orderTableBody');
const orderDetailsContent = document.getElementById('orderDetailsContent');
const statusSelect = document.getElementById('statusSelect');
const saveStatusBtn = document.getElementById('saveStatusBtn');

// API Endpoint
const API_BASE_URL = 'http://localhost:8080/api/orders';

// Biến để lưu orderID đang chỉnh sửa
let currentOrderId = null;

// Hàm định dạng trạng thái và màu sắc
function getStatusClass(status) {
    switch (status) {
        case 'Completed':
            return 'text-green-500';
        case 'Cancelled':
            return 'text-red-500';
        case 'Pending':
            return 'text-yellow-500';
        case 'Processing':
            return 'text-orange-500';
        default:
            return 'text-gray-600';
    }
}

// Hàm định dạng tên trạng thái
function formatStatus(status) {
    switch (status) {
        case 'Completed':
            return 'Thành công';
        case 'Cancelled':
            return 'Không thành công';
        case 'Pending':
            return 'Chờ xác nhận';
        case 'Processing':
            return 'Đang thực hiện';
        default:
            return 'Chưa xác định';
    }
}

// Hiển thị danh sách đơn hàng
async function renderOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const orders = await response.json();
        orders.sort((a, b) => a.orderID - b.orderID); // Sắp xếp theo orderID
        orderTableBody.innerHTML = '';
        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="py-3 px-6">${order.orderID}</td>
                <td class="py-3 px-6">${order.userID}</td>
                <td class="py-3 px-6">${order.userName}</td>
                <td class="py-3 px-6">${new Date(order.orderDate).toLocaleString('vi-VN')}</td>
                <td class="py-3 px-6">${Number(order.totalAmount).toLocaleString('vi-VN')} VNĐ</td>
                <td class="py-3 px-6">
                    <span class="${getStatusClass(order.status)} font-semibold">
                        ${formatStatus(order.status)}
                    </span>
                </td>
                <td class="py-3 px-6 flex space-x-2">
                    <button class="details-btn bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded" data-id="${order.orderID}">
                        <i class="fas fa-eye"></i> Chi tiết
                    </button>
                    ${
                        order.status === 'Cancelled' || order.status === 'Pending'|| order.status === 'Processing'
                            ? `<button class="edit-status-btn bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-1 rounded" data-id="${order.orderID}">
                                 <i class="fas fa-edit"></i> Sửa
                               </button>`
                            : ''
                    }
                </td>
            `;
            orderTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    }
}

// Hiển thị chi tiết đơn hàng trong popup
async function showOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const orders = await response.json();
        const order = orders.find(o => o.orderID == orderId); // Tìm đơn hàng theo orderID
        if (order) {
            orderDetailsContent.innerHTML = `
                <p><strong>ID đơn hàng:</strong> ${order.orderID}</p>
                <p><strong>Người dùng:</strong> ${order.userName} (ID: ${order.userID})</p>
                <p><strong>Ngày đặt hàng:</strong> ${new Date(order.orderDate).toLocaleString('vi-VN')}</p>
                <p><strong>Tổng đơn hàng:</strong> ${Number(order.totalAmount).toLocaleString('vi-VN')} VNĐ</p>
                <p><strong>Trạng thái:</strong> <span class="${getStatusClass(order.status)}">${formatStatus(order.status)}</span></p>
                <h3 class="text-lg font-semibold mt-4">Chi tiết sản phẩm:</h3>
                <table class="min-w-full bg-white border">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="py-2 px-4 border">Hình ảnh</th>
                            <th class="py-2 px-4 border">Tên sản phẩm</th>
                            <th class="py-2 px-4 border">Số lượng</th>
                            <th class="py-2 px-4 border">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.orderDetails.map(detail => `
                            <tr>
                                <td class="py-2 px-4 border"><img src="/img/${detail.imageUrl}" alt="${detail.productName}" class="h-10 w-10 object-cover"></td>
                                <td class="py-2 px-4 border">${detail.productName}</td>
                                <td class="py-2 px-4 border">${detail.quantity}</td>
                                <td class="py-2 px-4 border">${Number(detail.price).toLocaleString('vi-VN')} VNĐ</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            togglePopup(); // Mở popup
        }
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    }
}

// Mở popup chỉnh sửa trạng thái
function openEditStatusPopup(orderId) {
    currentOrderId = orderId;
    toggleEditStatusPopup();
}

// Cập nhật trạng thái đơn hàng
async function updateOrderStatus() {
    const newStatus = statusSelect.value;
    try {
        const response = await fetch(`${API_BASE_URL}/${currentOrderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
            alert('Cập nhật trạng thái thành công!');
            toggleEditStatusPopup();
            renderOrders(); // Tải lại danh sách đơn hàng
        } else {
            alert('Lỗi khi cập nhật trạng thái!');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
        alert('Có lỗi xảy ra: ' + error.message);
    }
}

// Xử lý sự kiện bấm nút "Chi tiết" và "Sửa"
orderTableBody.addEventListener('click', (e) => {
    if (e.target.closest('.details-btn')) {
        const orderId = e.target.closest('.details-btn').dataset.id;
        showOrderDetails(orderId);
    } else if (e.target.closest('.edit-status-btn')) {
        const orderId = e.target.closest('.edit-status-btn').dataset.id;
        openEditStatusPopup(orderId);
    }
});

// Xử lý sự kiện bấm nút "Lưu" trong popup chỉnh sửa trạng thái
saveStatusBtn.addEventListener('click', updateOrderStatus);

// Khởi chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
});