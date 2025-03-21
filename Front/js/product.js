// Lấy danh sách sản phẩm từ API và hiển thị lên trang
function fetchProducts() {
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
document.addEventListener("DOMContentLoaded", fetchProducts);





// Thêm sản phẩm mới (POST)
document.getElementById('add-product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const category = document.getElementById('category').value;

    const newProduct = { name, price, category };

    fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
        .then(response => response.json())
        .then(data => {
            fetchProducts(); // Cập nhật lại danh sách sản phẩm
            document.getElementById('name').value = '';
            document.getElementById('price').value = '';
            document.getElementById('category').value = '';
        })
        .catch(error => console.error('Có lỗi khi thêm sản phẩm:', error));
});

// Cập nhật sản phẩm (PUT)
function updateProduct(productId) {
    const name = prompt('Nhập tên sản phẩm mới:');
    const price = parseFloat(prompt('Nhập giá sản phẩm mới:'));
    const category = prompt('Nhập loại sản phẩm mới:');

    const updatedProduct = { name, price, category };

    fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    })
        .then(response => response.json())
        .then(() => fetchProducts()) // Cập nhật lại danh sách sản phẩm
        .catch(error => console.error('Có lỗi khi sửa sản phẩm:', error));
}

// Xóa sản phẩm (DELETE)
function deleteProduct(productId) {
    fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE'
    })
        .then(() => fetchProducts()) // Cập nhật lại danh sách sản phẩm
        .catch(error => console.error('Có lỗi khi xóa sản phẩm:', error));
}

// Lấy sản phẩm theo loại (GET)
function fetchProductsByCategory(categoryId) {
    fetch(`http://localhost:8080/api/products/category/${categoryId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Sản phẩm theo loại:', data);
        })
        .catch(error => console.error('Có lỗi xảy ra khi lấy sản phẩm theo loại:', error));
}

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
