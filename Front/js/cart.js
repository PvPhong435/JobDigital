// Tải sản phẩm khi trang được tải
document.addEventListener("DOMContentLoaded",function(){
    LoadUser();
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


function LoadUser() {
    const user = localStorage.getItem("user");
    if (user) {
        const userData = JSON.parse(user); // Chuyển chuỗi JSON thành object
        console.log(userData);

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
                cartList.appendChild(li); 
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
export async function deleteCartItem(cartID) {
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
window.deleteCartItem = deleteCartItem;

// Hàm tăng số lượng sản phẩm
export async function up(cartID, quantity) {
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
window.up = up;

// Hàm giảm số lượng sản phẩm
export async function down(cartID, quantity) {
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
window.down = down;

//Thêm sản phẩm vào giỏ hàng
export async function addCart(userID, productID, quantity) {
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





