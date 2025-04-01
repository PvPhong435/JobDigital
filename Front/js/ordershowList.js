let user = JSON.parse(localStorage.getItem("user"));
console.log(user);

document.addEventListener("DOMContentLoaded", function () {
    if (!user || !user.userID) {
        console.error("Không tìm thấy thông tin người dùng");
        return;
    }
    if (user.role === "Customer") {
        document.getElementById("sidebar").classList.add("hidden");
    }
    document.getElementById("user-name").innerText=user.fullName;

    const apiUrl = `http://localhost:8080/api/orders/${user.userID}`;
    const tableBody = document.getElementById("orderTableBody");
    const popupForm = document.getElementById("popup-form");
    const popupContent = document.getElementById("orderDetailsContent");

    function fetchOrders() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                tableBody.innerHTML = "";
                if (!data || data.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-3">Không có đơn hàng nào.</td></tr>`;
                    return;
                }

                data.forEach(order => {
                    const row = document.createElement("tr");
                    row.classList.add("border-b", "border-gray-200", "hover:bg-gray-100");
                    row.innerHTML = `
                        <td class="py-3 px-6 text-left">${order.orderID}</td>
                        <td class="py-3 px-6 text-left">${user.userID}</td>
                        <td class="py-3 px-6 text-left">${new Date(order.orderDate).toLocaleDateString()}</td>
                        <td class="py-3 px-6 text-left">${order.totalAmount.toLocaleString()}đ</td>
                        <td class="py-3 px-6 text-left font-semibold ${getStatusClass(order.status)}">${formatStatus(order.status)}</td>
                        <td class="py-3 px-6 text-left">
                            <button onclick="showOrderDetails(${order.orderID})" class="bg-blue-500 text-white px-3 py-1 rounded">Chi tiết</button>
                            <button style="display:none" class="bg-red-500 text-white px-3 py-1 rounded ml-2">Xóa</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Lỗi khi tải đơn hàng:", error));
    }

    function getStatusClass(status) {
        return status === "completed" ? "text-green-500" :
               status === "Cancelled" ? "text-red-500" :
               "text-yellow-500";
    }

    function formatStatus(status) {
        return status === "completed" ? "Thành công" :
               status === "Cancelled" ? "Không thành công" :
               "Chờ xác nhận";
    }

    window.showOrderDetails = function (orderId) {
        console.log(`Lấy chi tiết đơn hàng: ${orderId}`);
    
        fetch(`http://localhost:8080/api/orders/details/${orderId}`)
            .then(response => {
                if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
                return response.json();
            })
            .then(orderDetails => {  // Bây giờ orderDetails là một mảng
                console.log(orderDetails);
                if (!orderDetails || orderDetails.length === 0) {
                    popupContent.innerHTML = `<p class="text-red-500">Không có chi tiết đơn hàng.</p>`;
                } else {
                    let detailsHtml = `<p class="font-bold">Chi tiết đơn hàng #${orderId}</p>`;
                    orderDetails.forEach(detail => {
                        detailsHtml += `
                        <div class="mb-4 p-4 border rounded-lg shadow-md bg-white">
                        <div class="flex items-center space-x-4">
                            <img src="${detail.imageUrl || `/img/${detail.productImg}`}"
                                 alt="Hình ảnh sản phẩm"
                                 class="w-16 h-16 object-cover rounded-md border">
                            <div>
                                <p class="font-semibold text-lg text-gray-800">${detail.productName || "Không rõ"}</p>
                                <p class="text-sm text-gray-600">Số lượng: <span class="font-medium">${detail.quantity || 0}</span></p>
                                <p class="text-sm text-gray-600">Giá: <span class="text-blue-600 font-semibold">${(detail.price || 0).toLocaleString()}đ</span></p>
                            </div>
                        </div>
                    </div>
                    
                        `;
                    });
                    popupContent.innerHTML = detailsHtml;
                }
                popupForm.classList.remove("hidden");
            })
            .catch(error => {
                console.error("Lỗi khi tải chi tiết đơn hàng:", error);
                popupContent.innerHTML = `<p class="text-red-500">Lỗi khi tải dữ liệu.</p>`;
            });
    };
    

    document.getElementById("popup-form").addEventListener("click", function (event) {
        if (event.target.id === "popup-form") {
            popupForm.classList.add("hidden");
        }
    });

    fetchOrders();
});
