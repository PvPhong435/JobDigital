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
                const userId = document.getElementById("user-id").textContent;
                productDiv.innerHTML = `
                    <img src="/img/${product.imageURL}" alt="${product.imageURL}" 
                        class="w-full h-48 object-cover mb-4 rounded-lg" width="300" height="300"/>
                    <p class="text-sm text-gray-600 mb-2 font-semibold">${product.productName}</p>
                    <p class="text-sm text-gray-400 line-through">${oldPrice.toLocaleString()}₫</p>
                    <p class="text-lg font-bold text-teal-800">${product.price.toLocaleString()}₫</p>
                    <p class="text-sm text-gray-500 mb-2">${product.description}</p>
                    <p class="text-sm text-gray-700">Số lượng tồn kho: ${product.stock}</p>
                    <button id="add-to-cart-btn-${product.productID}" 
                            class="bg-[#96644b] text-white py-2 px-4 rounded mt-4 w-full">
                        Thêm Vào Giỏ Hàng
                    </button>

                `;

                // Thêm sự kiện cho nút "Thêm vào giỏ hàng"
                // Đảm bảo sự kiện được gán sau khi tạo phần tử HTML
                setTimeout(() => {
                    const addToCartBtn = document.getElementById(`add-to-cart-btn-${product.productID}`);
                    if (addToCartBtn && !addToCartBtn.dataset.listener) {
                        addToCartBtn.dataset.listener = "true"; // Đánh dấu đã gán sự kiện
                        addToCartBtn.addEventListener("click", function (event) {
                            event.stopPropagation(); // Ngăn sự kiện click lan lên productDiv
                            addCart(userId, product.productID, 1);
                        });
                    }
                }, 0);



                // Sự kiện click để chuyển đến trang chi tiết sản phẩm
                productDiv.addEventListener("click", function () {
                    localStorage.setItem("selectedProduct", JSON.stringify(product)); // Lưu sản phẩm vào localStorage
                    window.location.href = `detail2.html`; // Chuyển trang
                });
                productContainer.appendChild(productDiv);
            });
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm:", error));
}

// Lấy 5 sản phẩm từ API và hiển thị lên trang
function fetchProducts2() {
    LoadUser();
    fetch("http://localhost:8080/api/products/random")
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById("product-list2");
            productContainer.innerHTML = ""; // Xóa nội dung cũ

            products.slice(0, 4).forEach(product => {
                const oldPrice = product.price + 1000000; // Giá cũ = Giá mới + 1 triệu

                const productDiv = document.createElement("div");
                productDiv.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "cursor-pointer");
                productDiv.dataset.productId = product.id; // Gán productId vào dataset
                const userId = document.getElementById("user-id").textContent;
                productDiv.innerHTML = `
                    <img src="/img/${product.imageURL}" alt="${product.imageURL}" 
                        class="w-full h-48 object-cover mb-4 rounded-lg" width="300" height="300"/>
                    <p class="text-sm text-gray-600 mb-2 font-semibold">${product.productName}</p>
                    <p class="text-sm text-gray-400 line-through">${oldPrice.toLocaleString()}₫</p>
                    <p class="text-lg font-bold text-teal-800">${product.price.toLocaleString()}₫</p>
                    <p class="text-sm text-gray-500 mb-2">${product.description}</p>
                    <p class="text-sm text-gray-700">Số lượng tồn kho: ${product.stock}</p>
                    <button id="add-to-cart-btn-${product.productID}" 
                            class="bg-[#96644b] text-white py-2 px-4 rounded mt-4 w-full">
                        Thêm Vào Giỏ Hàng
                    </button>

                `;

                // Thêm sự kiện cho nút "Thêm vào giỏ hàng"
                // Đảm bảo sự kiện được gán sau khi tạo phần tử HTML
                setTimeout(() => {
                    const addToCartBtn = document.getElementById(`add-to-cart-btn-${product.productID}`);
                    if (addToCartBtn && !addToCartBtn.dataset.listener) {
                        addToCartBtn.dataset.listener = "true"; // Đánh dấu đã gán sự kiện
                        addToCartBtn.addEventListener("click", function (event) {
                            event.stopPropagation(); // Ngăn sự kiện click lan lên productDiv
                            addCart(userId, product.productID, 1);
                        });
                    }
                }, 0);



                // Sự kiện click để chuyển đến trang chi tiết sản phẩm
                productDiv.addEventListener("click", function () {
                    localStorage.setItem("selectedProduct", JSON.stringify(product)); // Lưu sản phẩm vào localStorage
                    window.location.href = `detail2.html`; // Chuyển trang
                });
                productContainer.appendChild(productDiv);
            });
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm:", error));
}

// Tải sản phẩm khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
    fetchProducts();
    fetchProducts2();
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
                        <button onclick="down(${item.cartId}, ${item.quantity})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="up(${item.cartId}, ${item.quantity})">+</button>
                        <button onclick="deleteCartItem(${item.cartId})">🗑</button>
                    </div>
                `;
                cartList.appendChild(li); // Đẩy sản phẩm mới lên trên cùng
            });
            // Thêm nút "Đặt hàng" ở cuối danh sách
            const checkoutButton = document.createElement("button");
            checkoutButton.classList.add("checkout-button");
            checkoutButton.textContent = "Đặt hàng";
            checkoutButton.onclick = () => {
                window.location.href = "PayPage.html"; // Điều hướng đến trang PayPage
            };
            cartList.appendChild(checkoutButton);
        }
    } catch (error) {
        console.error(error);
    }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
async function deleteCartItem(cartID) {
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

// Hàm tăng số lượng sản phẩm
async function up(cartID, quantity) {
    try {
        const response = await fetch(`http://localhost:8080/api/cart/update/${cartID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: quantity + 1 }),
        });

        if (!response.ok) throw new Error("Lỗi khi tăng số lượng");
        loadCartItems(); // Load lại giỏ hàng
    } catch (error) {
        console.error(error);
    }
}

// Hàm giảm số lượng sản phẩm
async function down(cartID, quantity) {
    if (quantity <= 1) {
        deleteCartItem(cartID);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cart/update/${cartID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: quantity - 1 }),
        });

        if (!response.ok) throw new Error("Lỗi khi giảm số lượng");
        loadCartItems(); // Load lại giỏ hàng
    } catch (error) {
        console.error(error);
    }
}

//Thêm sản phẩm vào giỏ hàng
async function addCart(userID, productID, quantity) {
    // Tạo đối tượng CartRequest từ các tham số đầu vào
    const cartRequest = {
        cartID: null,
        userID: userID,
        productID: productID,
        quantity: quantity
    };
    console.log(cartRequest);

    try {
        // Gửi HTTP POST request tới server
        const response = await fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Đảm bảo gửi dữ liệu dưới dạng JSON
            },
            body: JSON.stringify(cartRequest) // Chuyển đối tượng thành chuỗi JSON
        });

        // Kiểm tra nếu request thành công
        if (response.ok) {
            const data = await response.json(); // Chuyển phản hồi từ server thành đối tượng JSON
            console.log('Giỏ hàng đã được thêm thành công:', data);
            alert("Thêm sản phẩm vào giỏ hàng thành công");
            loadCartItems();
        } else {
            // Nếu có lỗi xảy ra
            console.error('Lỗi khi thêm giỏ hàng:', response.statusText);
            alert("Lỗi trong quá trình thêm sản phẩm vui lòng thử lại");
        }
    } catch (error) {
        // Bắt lỗi nếu có vấn đề trong quá trình gửi request
        console.error('Có lỗi xảy ra trong quá trình gửi request:', error);
    }
}

