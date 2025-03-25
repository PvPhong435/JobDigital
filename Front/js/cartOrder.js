document.addEventListener("DOMContentLoaded", function () {
    loadCartItems();
});


async function loadCartItems() {
    const user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("user-id").innerText = user.userID;
    document.getElementById("user-name").innerText = user.username;
    document.getElementById("user-idPay").innerText = user.userID;
    document.getElementById("user-namePay").innerText = user.fullName;
    document.getElementById("user-emailPay").innerText = user.email;
    console.log(user);
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
                console.log(item.productName+item.quantity)
                li.classList.add("cart-item", "flex", "justify-between", "items-center", "mb-4", "p-4", "border-b");
                li.innerHTML = `
                <div class="flex items-center justify-between w-full p-3 border-b">
                    <!-- Checkbox và hình ảnh -->
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="checkout-${item.cartId}" class="w-5 h-5">
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
