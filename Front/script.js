const BASE_URL = "http://localhost:8080"; // API chạy trên cổng 8080
const IMAGE_FOLDER = "img/"; // Đường dẫn chứa ảnh

document.addEventListener("DOMContentLoaded", function () {
    // 📌 Fetch danh mục sản phẩm
    fetch(`${BASE_URL}/api/category`)
        .then(response => response.json())
        .then(categories => {
            const categoryMenu = document.getElementById("categoryMenu");
            categoryMenu.innerHTML = "";
            categories.forEach(category => {
                categoryMenu.innerHTML += `
                    <li><a class="dropdown-item" href="products.html?category=${category.categoryID}">${category.categoryName}</a></li>
                `;
            });
        })
        .catch(error => console.error("❌ Lỗi tải danh mục:", error));

    // 📌 Fetch sản phẩm bán chạy
    fetch(`${BASE_URL}/api/products/random`)
        .then(response => response.json())
        .then(products => {
            const bestSellingContainer = document.getElementById("best-selling-products");
            bestSellingContainer.innerHTML = "";
            products.forEach(product => {
                let imageSrc = `${IMAGE_FOLDER}${product.imageURL}`;
                let oldPrice = product.price + 500000; // Giá cũ = Giá mới + 500k

                bestSellingContainer.innerHTML += `
                    <div class="col-md-3 product-item" onclick="redirectToDetail(${product.productID}, ${product.categoryID})" style="cursor:pointer;">
                        <div class="border p-3 rounded text-center">
                            <img src="${imageSrc}" alt="${product.productName}" onerror="this.onerror=null; this.src='img/default.jpg'">
                            <h5>${product.productName}</h5>
                            <p class="text-danger"><del>${oldPrice.toLocaleString()} VND</del></p>
                            <p><strong>${product.price.toLocaleString()} VND</strong></p>
                            <button class="btn btn-primary">MUA NGAY</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => console.error("❌ Lỗi tải sản phẩm bán chạy:", error));
});

// 📌 Chuyển hướng đến trang chi tiết sản phẩm
function redirectToDetail(productID, categoryID) {
    window.location.href = `product-detail.html?id=${productID}&category=${categoryID}`;
}

// 📌 Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productID) {
    const userID = 2; // 🛒 ID user đăng nhập (tạm thời)

    fetch(`${BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userID: userID,
            productID: productID,
            quantity: 1
        })
    })
    .then(response => response.json())
    .then(data => alert("✅ Sản phẩm đã được thêm vào giỏ hàng!"))
    .catch(error => console.error("❌ Lỗi thêm vào giỏ hàng:", error));
}
