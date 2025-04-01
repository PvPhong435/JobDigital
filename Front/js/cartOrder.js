let totalPriceAll=0;
let user;
document.addEventListener("DOMContentLoaded", function () {
    totalPriceAll=0;
    user = JSON.parse(localStorage.getItem("user"));
    localStorage.removeItem("productList");
    loadCartItems();
    document.getElementById("btnDatHang").addEventListener("click", function () {
        // Lấy danh sách sản phẩm từ localStorage
        let productList = JSON.parse(localStorage.getItem("productList")) || [];
        const now = new Date();

        const order = {
            userId: Number(user.userID),
            orderDate: new Date().toISOString().replace("Z", "").split(".")[0], // Ngày đặt hàng (ISO format)
            totalAmount: Number(totalPriceAll), // Tổng tiền (có thể cập nhật)
            status: "Pending" // Trạng thái đơn hàng (pending, completed, canceled, etc.)
        };
        if (productList.length === 0) {
            alert("Bạn chưa chọn sản phẩm nào! Vui lòng chọn sản phẩm trước khi đặt hàng.");
        } else {
            // Lưu vào localStorage
            localStorage.setItem("order", JSON.stringify(order));
            console.log(productList);
            console.log("Đã lưu đơn hàng vào localStorage:", order);
            removeProductBeforePaying(productList,user.userID);
            window.location.href = "Order.html"; // Chuyển hướng đến trang thanh toán
        }
    });
    
});

function formatDateTime(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


async function loadCartItems() {
    if(user.userID === null)
    {
        document.getElementById("user-id").innerText ="8";
    }
    else
    {
        document.getElementById("user-id").innerText = user.userID;
    }
    
    document.getElementById("user-name").innerText = user.username;
    document.getElementById("user-idPay").innerText = user.userID;
    document.getElementById("user-namePay").innerText = user.fullName;
    document.getElementById("user-emailPay").innerText = user.email;

    document.getElementById("tongTien").innerText = `0 VND`;
    document.getElementById("tongSoSanPham").innerText = 0;
    const cartContainer = document.querySelector(".bg-white.p-6");
    const userId = document.getElementById("user-id").textContent;

    try {
        const response = await fetch(`http://localhost:8080/api/cart/user/${userId}`);
        if (!response.ok) throw new Error("Lỗi khi lấy giỏ hàng");
        const cartData = await response.json();

        const cartList = cartContainer.querySelector("#cart-list");
        cartList.innerHTML = ""; // Xóa nội dung cũ
        if (cartData.length === 0) {
            cartList.innerHTML = "<li>Giỏ hàng trống</li>";
        } else {
            cartData.forEach(item => {
                const li = document.createElement("li");
                li.classList.add("cart-item", "flex", "justify-between", "items-center", "mb-4", "p-4", "border-b");
                li.innerHTML = `
                <div class="flex items-center justify-between w-full p-3 border-b">
                    <!-- Checkbox và hình ảnh -->
                    <div class="flex items-center gap-3">
                    <input type="checkbox" id="checkout-${item.cartId}" class="w-5 h-5 product-checkbox" data-productid="${item.productId}" data-price="${item.price}" data-quantity="${item.quantity}">
                        <img src="/img/${item.productImage}" alt="${item.productName}" class="w-20 h-20 object-cover rounded">
                    </div>

                    <!-- Thông tin sản phẩm -->
                    <div class="flex-1 text-center">
                        <h3 class="font-semibold">${item.productName}</h3>
                        <p class="text-gray-600">Giá: ${item.price.toLocaleString()} VND</p>
                    </div>

                    <!-- Hành động: tăng/giảm/xóa -->
                    <div class="flex items-center gap-2">
                        <button onclick="down(${item.cartId}, ${item.quantity})" class="px-3 py-1 bg-gray-300 rounded">-</button>
                        <span class="w-6 text-center">${item.quantity}</span>
                        <button onclick="up(${item.cartId}, ${item.quantity})" class="px-3 py-1 bg-gray-300 rounded">+</button>
                        <button onclick="deleteCartItem(${item.cartId})" class="text-red-600 text-lg">🗑</button>
                    </div>
                </div>
                    `;
                cartList.appendChild(li);
            });
            addCheckboxEventListeners();
        }
    } catch (error) {
        console.error(error);
    }
}



async function placeOrder() {
    const selectedItems = Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
        .map(checkbox => checkbox.id.replace("checkout-", ""));

    if (selectedItems.length === 0) {
        alert("Vui lòng chọn sản phẩm để thanh toán.");
        return;
    }

    await fetch("http://localhost:8080/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: document.getElementById("user-id").textContent, items: selectedItems })
    });

    alert("Đặt hàng thành công!");
    loadCartItems();
}


// Hàm tăng số lượng sản phẩm
async function up(cartID, quantity) {
    console.log("Tăng")
    console.log(quantity)
    try {
        const response = await fetch(`http://localhost:8080/api/cart/update/${cartID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({quantity: quantity + 1 }),
        });
        

        if (!response.ok) throw new Error("Lỗi khi tăng số lượng");
        loadCartItems(); // Load lại giỏ hàng
        tongTien();
    } catch (error) {
        console.error(error);
    }
}

// Hàm giảm số lượng sản phẩm
async function down(cartID, quantity) {
    console.log("Giảm")
    if (quantity <= 1) {
        deleteCartItem(cartID);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cart/update/${cartID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({quantity: quantity - 1 }),
        });
        
        if (!response.ok) throw new Error("Lỗi khi giảm số lượng");
        loadCartItems(); // Load lại giỏ hàng
        tongTien();
    } catch (error) {
        console.error(error);
    }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
async function deleteCartItem(cartID) {
    console.log("Xóa")
    try {
        const response = await fetch(`http://localhost:8080/api/cart/remove/${cartID}`, {
            method: "DELETE",
        });
        
        if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm");
        loadCartItems(); // Load lại giỏ hàng
        tongTien();
    } catch (error) {
        console.error(error);
    }
}

function getSelectedProducts() {
    const selectedItems = [];
    const checkedCheckboxes = document.querySelectorAll("#cart-list input[type='checkbox']:checked");

    checkedCheckboxes.forEach(checkbox => {
        const cartItem = checkbox.closest(".cart-item"); // Lấy phần tử cha chứa sản phẩm
        const productName = cartItem.querySelector("h3").innerText; // Tên sản phẩm
        const quantity = parseInt(cartItem.querySelector("span").innerText); // Số lượng
        const cartId = checkbox.id.replace("checkout-", ""); // Lấy cartId từ ID của checkbox

        selectedItems.push({ cartId, productName, quantity });
    });

    console.log(selectedItems); // Kiểm tra danh sách đã chọn
    return selectedItems;
}

function tongTien() {
    let total = 0;
    let totalQuantity = 0;
    let productList = JSON.parse(localStorage.getItem("productList")) || []; // Lấy danh sách từ localStorage

    document.querySelectorAll(".product-checkbox:checked").forEach(checkbox => {
        const productId = checkbox.dataset.productid; // Lấy productId từ data
        const price = parseFloat(checkbox.dataset.price);
        const quantity = parseInt(checkbox.dataset.quantity);

        total += price * quantity;
        totalQuantity += quantity;

        // Kiểm tra xem sản phẩm đã có trong danh sách chưa
        let existingProduct = productList.find(item => item.productId === productId);
        if (!existingProduct) {
            productList.push({ productId, quantity,price }); // Thêm sản phẩm mới vào danh sách
        }
    });

    // Cập nhật vào localStorage
    localStorage.setItem("productList", JSON.stringify(productList));

    // Cập nhật vào giao diện
    totalPriceAll=total;
    document.getElementById("tongTien").innerText = `${total.toLocaleString()} VND`;
    document.getElementById("tongSoSanPham").innerText = totalQuantity;
}

function addProductToLocalStorage(productId) {
    // Bước 1: Lấy danh sách hiện tại từ localStorage
    let productIds = JSON.parse(localStorage.getItem("productIds")) || [];

    // Bước 2: Thêm sản phẩm mới vào danh sách
    if (!productIds.includes(productId)) { // Kiểm tra tránh trùng lặp
        productIds.push(productId);
    }

    // Bước 3: Lưu lại danh sách mới vào localStorage
    localStorage.setItem("productIds", JSON.stringify(productIds));

    console.log("Danh sách sản phẩm sau khi thêm:", productIds);
}
function addCheckboxEventListeners() {
    document.querySelectorAll(".product-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            let productList = JSON.parse(localStorage.getItem("productList")) || [];
            const productId = this.dataset.productid;
            const quantity = parseInt(this.dataset.quantity);
            const price = parseFloat(this.dataset.price);

            if (this.checked) {
                // Nếu checkbox được chọn, thêm sản phẩm vào danh sách nếu chưa có
                let existingProduct = productList.find(item => item.productId === productId);
                if (existingProduct) {
                    existingProduct.quantity = quantity; // Cập nhật số lượng
                    existingProduct.price = price; // Cập nhật giá (phòng khi thay đổi)
                } else {
                    productList.push({ productId, quantity, price });
                }
            } else {
                // Nếu bỏ chọn, xóa sản phẩm khỏi danh sách
                productList = productList.filter(item => item.productId !== productId);
            }

            // Cập nhật localStorage
            localStorage.setItem("productList", JSON.stringify(productList));

            // Gọi lại hàm tính tổng tiền
            tongTien();
        });
    });
}

async function removeProductBeforePaying(productList, userId) {
    if (!Array.isArray(productList) || productList.length === 0) {
        console.log("Danh sách sản phẩm rỗng hoặc không hợp lệ.");
        return;
    }

    for (const product of productList) {
        const productId = product.productId; // Lấy productId từ object trong danh sách
        const url = `http://localhost:8080/api/cart/remove/${userId}/${productId}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                console.log(`Đã xóa sản phẩm ${productId} thành công.`);
            } else {
                console.error(`Lỗi khi xóa sản phẩm ${productId}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Lỗi khi gửi yêu cầu xóa sản phẩm ${productId}:`, error);
        }
    }
}

