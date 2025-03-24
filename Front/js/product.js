// Lấy danh sách sản phẩm từ API và hiển thị lên trang
function fetchProducts() {
    LoadUser();
    fetch("http://localhost:8080/api/products")
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById("product-list");
            productContainer.innerHTML = ""; // Xóa nội dung cũ

            products.slice(0, 8).forEach(product => {
                const oldPrice = product.price + 1000000; // Giá cũ = Giá mới + 1 triệu

                const productDiv = document.createElement("div");
                productDiv.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "cursor-pointer");
                productDiv.dataset.productId = product.id; // Gán productId vào dataset

                productDiv.innerHTML = `
                    <img src="/img/${product.imageURL}" alt="${product.imageURL}" 
                        class="w-full h-48 object-cover mb-4 rounded-lg" width="300" height="300"/>
                    <p class="text-sm text-gray-600 mb-2 font-semibold">${product.productName}</p>
                    <p class="text-sm text-gray-400 line-through">${oldPrice.toLocaleString()}₫</p>
                    <p class="text-lg font-bold text-teal-800">${product.price.toLocaleString()}₫</p>
                    <p class="text-sm text-gray-500 mb-2">${product.description}</p>
                    <p class="text-sm text-gray-700">Số lượng tồn kho: ${product.stock}</p>
                    <button class="bg-[#96644b] text-white py-2 px-4 rounded mt-4 w-full">MUA NGAY</button>
                    <p class="text-center text-sm text-yellow-500 mt-2">Thêm vào giỏ hàng</p>
                `;

                // Sự kiện click để chuyển đến trang chi tiết sản phẩm
                productDiv.addEventListener("click", function () {
                    localStorage.setItem("selectedProduct", JSON.stringify(product)); // Lưu sản phẩm vào localStorage
                    window.location.href = `detail2.html?productId=${product.id}`; // Chuyển trang
                });

                productContainer.appendChild(productDiv);
            });
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm:", error));
}

// Tải sản phẩm khi trang được tải
document.addEventListener("DOMContentLoaded",function(){
    fetchProducts();
    LoadUser()
    document.getElementById("logout-Button").addEventListener("click", logoutUser);
    // Thêm sự kiện click vào giỏ hàng
    const cartContainer = document.getElementById("cart-container");
    const cartList = document.getElementById("cart-list");

    // Hiện giỏ hàng khi rê chuột vào
    cartContainer.addEventListener("mouseenter", function () {
        cartList.classList.remove("hidden");
    });

    // Ẩn giỏ hàng khi rời chuột
    cartContainer.addEventListener("mouseleave", function () {
        cartList.classList.add("hidden");
    });

    loadCartItems();
});

// Lấy sản phẩm theo loại (GET)
function fetchProductsByCategory(categoryId) {
    fetch(`http://localhost:8080/api/products/category/${categoryId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Sản phẩm theo loại:', data);
        })
        .catch(error => console.error('Có lỗi xảy ra khi lấy sản phẩm theo loại:', error));
}

// Tải danh sách sản phẩm khi trang được tải
fetchProducts();

// Lấy 5 sản phẩm bán chạy nhất (GET)
function fetchTopSellingProducts() {
    fetch('http://localhost:8080/api/products/random')
        .then(response => response.json())
        .then(data => {
            console.log('5 sản phẩm bán chạy nhất:', data);
        })
        .catch(error => console.error('Có lỗi xảy ra khi lấy sản phẩm bán chạy:', error));
}

// Tải danh sách sản phẩm khi trang được tải
fetchProducts();


function LoadUser() {
    const user = localStorage.getItem("user");
    if (user) {
        const userData = JSON.parse(user); // Chuyển chuỗi JSON thành object

        // Hiển thị thông tin user
        document.getElementById("user-id").innerText = ` ${userData.userID}`;
        document.getElementById("user-name").innerText = `| ${userData.fullName}`;
        


        // Ẩn nút "Đăng nhập", hiển thị thông tin user
        document.getElementById("login-Button").style.display = "none";
        document.getElementById("user-info").style.display = "block";
    } else {
        // Nếu chưa đăng nhập, hiển thị "Đăng nhập"
        document.getElementById("login-Button").style.display = "block";
        document.getElementById("user-info").style.display = "none";
    }
}

function logoutUser() {
    console.log("Người dùng đã đăng xuất!");
    
    // Xóa thông tin đăng nhập trong localStorage
    localStorage.clear();
    localStorage.removeItem("token");

    // Chuyển hướng về trang đăng nhập
    window.location.href = "login.html";
}

// Lấy danh sách sản phẩm trong giỏ hàng của user
async function loadCartItems() {
    const cartList = document.getElementById("cart-list");
    const userId = document.getElementById("user-id").textContent;
    console.log(userId);

    try {
        const response = await fetch(`http://localhost:8080/api/cart/user/${userId}`);
        if (!response.ok) throw new Error("Lỗi khi lấy giỏ hàng");
        const cartData = await response.json();

        cartList.innerHTML = ""; // Xóa nội dung cũ

        if (cartData.length === 0) {
            cartList.innerHTML = "<li>Giỏ hàng trống</li>";
        } else {
            cartData.forEach(item => {
                const li = document.createElement("li");
                li.classList.add("cart-item");
                li.innerHTML = `
                    <img src="/img/${item.productImage}" alt="${item.productName}" class="cart-image">
                    <div class="cart-info">
                        <h3>${item.productName}</h3>
                        <p>Giá: ${item.price.toLocaleString()} VND</p>
                    </div>
                    <div class="cart-actions">
                        <button onclick="down(${item.productId}, ${item.quantity})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="up(${item.productId}, ${item.quantity})">+</button>
                        <button onclick="deleteCartItem(${item.productId})">🗑</button>
                    </div>
                `;
                cartList.prepend(li); // Đẩy sản phẩm mới lên trên cùng
            });
            // Thêm nút "Đặt hàng" ở cuối danh sách
            const checkoutButton = document.createElement("button");
            checkoutButton.classList.add("checkout-button");
            checkoutButton.textContent = "Đặt hàng";
            checkoutButton.onclick = placeOrder;
            cartList.appendChild(checkoutButton);
        }
    } catch (error) {
        console.error(error);
    }
}

// Hàm xử lý đặt hàng
function placeOrder() {
    alert("Đặt hàng thành công!"); // Thay thế bằng logic đặt hàng của bạn
}

// Hàm xóa sản phẩm khỏi giỏ hàng
async function deleteCartItem(productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/cart/remove/${productId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm");
        loadCartItems(); // Load lại giỏ hàng
    } catch (error) {
        console.error(error);
    }
}

// Hàm tăng số lượng sản phẩm
async function up(productId, quantity) {
    try {
        const response = await fetch(`http://localhost:8080/api/cart/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: quantity + 1 }),
        });

        if (!response.ok) throw new Error("Lỗi khi tăng số lượng");
        loadCartItems(); // Load lại giỏ hàng
    } catch (error) {
        console.error(error);
    }
}

// Hàm giảm số lượng sản phẩm
async function down(productId, quantity) {
    if (quantity <= 1) {
        deleteCartItem(productId);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cart/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: quantity - 1 }),
        });

        if (!response.ok) throw new Error("Lỗi khi giảm số lượng");
        loadCartItems(); // Load lại giỏ hàng
    } catch (error) {
        console.error(error);
    }
}