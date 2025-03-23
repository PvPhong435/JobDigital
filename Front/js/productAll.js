let currentPage = 1;
const itemsPerPage = 9;
let allProducts = []; // Lưu toàn bộ sản phẩm để phân trang

// Lấy danh sách sản phẩm từ API và hiển thị lên trang
function fetchProducts() {
    fetch("http://localhost:8080/api/products")
        .then(response => response.json())
        .then(products => {
            allProducts = products; // Lưu toàn bộ sản phẩm
            displayProducts(); // Hiển thị sản phẩm theo trang
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm:", error));
}

// Hiển thị danh sách sản phẩm theo trang hiện tại
function displayProducts() {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = ""; // Xóa nội dung cũ

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const oldPrice = product.price + 1000000; // Giá cũ = Giá mới + 1 triệu

        const productDiv = document.createElement("div");
        productDiv.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "cursor-pointer");
        productDiv.dataset.productId = product.id;

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
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = `detail2.html?productId=${product.id}`;
        });

        productContainer.appendChild(productDiv);
    });

    updatePagination();
}

// Cập nhật thông tin phân trang
function updatePagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Xóa các nút cũ

    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    
    // Nút "Trang trước"
    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&#171;"; // «
    prevButton.classList.add("pagination-btn");
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
        }
    });
    paginationContainer.appendChild(prevButton);

    // Hiển thị các nút số trang (giới hạn hiển thị tối đa 5 trang liên tục)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("pagination-btn");
        if (i === currentPage) {
            pageButton.classList.add("active"); // Đánh dấu trang hiện tại
        }
        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayProducts();
        });
        paginationContainer.appendChild(pageButton);
    }

    // Nút "Trang sau"
    const nextButton = document.createElement("button");
    nextButton.innerHTML = "&#187;"; // »
    nextButton.classList.add("pagination-btn");
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
        }
    });
    paginationContainer.appendChild(nextButton);
}


// Chuyển trang trước
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayProducts();
    }
}

// Chuyển trang sau
function nextPage() {
    if (currentPage < Math.ceil(allProducts.length / itemsPerPage)) {
        currentPage++;
        displayProducts();
    }
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    })
        .then(response => response.json())
        .then(() => {
            fetchProducts(); // Cập nhật danh sách sản phẩm
            document.getElementById('add-product-form').reset();
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
    })
        .then(response => response.json())
        .then(() => fetchProducts()) // Cập nhật danh sách
        .catch(error => console.error('Có lỗi khi sửa sản phẩm:', error));
}

// Xóa sản phẩm (DELETE)
function deleteProduct(productId) {
    fetch(`http://localhost:8080/api/products/${productId}`, { method: 'DELETE' })
        .then(() => fetchProducts()) // Cập nhật danh sách
        .catch(error => console.error('Có lỗi khi xóa sản phẩm:', error));
}

// Lấy sản phẩm theo loại (GET)
function fetchProductsByCategory(categoryId) {
    fetch(`http://localhost:8080/api/products/category/${categoryId}`)
        .then(response => response.json())
        .then(data => console.log('Sản phẩm theo loại:', data))
        .catch(error => console.error('Có lỗi xảy ra khi lấy sản phẩm theo loại:', error));
}

// Lấy 5 sản phẩm bán chạy nhất (GET)
function fetchTopSellingProducts() {
    fetch('http://localhost:8080/api/products/random')
        .then(response => response.json())
        .then(data => console.log('5 sản phẩm bán chạy nhất:', data))
        .catch(error => console.error('Có lỗi xảy ra khi lấy sản phẩm bán chạy:', error));
}
