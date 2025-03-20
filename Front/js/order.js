// Lấy danh sách đơn hàng của người dùng (GET)
function fetchOrders(userId) {
    fetch(`http://localhost:8080/api/orders/${userId}`)
        .then(response => response.json())
        .then(data => {
            const orderList = document.getElementById('order-list');
            orderList.innerHTML = '';  // Xóa dữ liệu cũ

            data.forEach(order => {
                const row = document.createElement('tr');

                const orderIdCell = document.createElement('td');
                orderIdCell.textContent = order.orderId;
                row.appendChild(orderIdCell);

                const orderDetailsCell = document.createElement('td');
                orderDetailsCell.textContent = order.details;
                row.appendChild(orderDetailsCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = order.status;
                row.appendChild(statusCell);

                // Thêm nút hành động: cập nhật và xóa
                const actionCell = document.createElement('td');
                
                // Nút cập nhật trạng thái
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Cập nhật Trạng thái';
                updateButton.onclick = () => updateOrderStatus(order.orderId);
                actionCell.appendChild(updateButton);

                // Nút xóa đơn hàng
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Hủy Đơn';
                deleteButton.onclick = () => deleteOrder(order.orderId);
                actionCell.appendChild(deleteButton);

                row.appendChild(actionCell);
                orderList.appendChild(row);
            });
        })
        .catch(error => console.error('Có lỗi xảy ra:', error));
}

// Tạo đơn hàng mới (POST)
document.getElementById('create-order-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;
    const orderDetails = document.getElementById('orderDetails').value;

    const newOrder = { userId, details: orderDetails };

    fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
    })
        .then(response => response.json())
        .then(data => {
            fetchOrders(userId); // Cập nhật lại danh sách đơn hàng
            document.getElementById('userId').value = '';
            document.getElementById('orderDetails').value = '';
        })
        .catch(error => console.error('Có lỗi khi tạo đơn hàng:', error));
});

// Cập nhật trạng thái đơn hàng (PUT)
function updateOrderStatus(orderId) {
    const status = prompt('Nhập trạng thái mới (Ví dụ: CONFIRMED):');

    fetch(`http://localhost:8080/api/orders/update/${orderId}?status=${status}`, {
        method: 'PUT'
    })
        .then(() => fetchOrders(orderId)) // Cập nhật lại danh sách đơn hàng
        .catch(error => console.error('Có lỗi khi cập nhật trạng thái đơn hàng:', error));
}

// Xóa đơn hàng (DELETE)
function deleteOrder(orderId) {
    fetch(`http://localhost:8080/api/orders/${orderId}`, {
        method: 'DELETE'
    })
        .then(() => fetchOrders()) // Cập nhật lại danh sách đơn hàng
        .catch(error => console.error('Có lỗi khi xóa đơn hàng:', error));
}

// Lấy chi tiết đơn hàng (GET)
function fetchOrderDetails(orderId) {
    fetch(`http://localhost:8080/api/orders/details/${orderId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Chi tiết đơn hàng:', data);
        })
        .catch(error => console.error('Có lỗi xảy ra khi lấy chi tiết đơn hàng:', error));
}

// Tải đơn hàng của người dùng khi trang được tải
const userId = 1; // Ví dụ, lấy đơn hàng của người dùng có ID là 1
fetchOrders(userId);
