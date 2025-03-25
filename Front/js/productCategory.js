import { addCart } from "./cart.js";

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("categoryId") || 1;
    const itemsPerPage = 8; // Số sản phẩm trên mỗi trang
    let currentPage = 1;
    let allProducts = [];

    function fetchProducts() {
        fetch(`http://localhost:8080/api/products/category/${categoryId}`)
            .then(response => response.json())
            .then(products => {
                allProducts = products;
                if (allProducts.length === 0) {
                    document.getElementById("product-list").innerHTML = `<p class="text-center text-gray-500">Không có sản phẩm nào</p>`;
                    return;
                }
                displayProducts();
                updatePagination();
            })
            .catch(error => console.error("Lỗi khi tải sản phẩm:", error));
    }

    function displayProducts() {
        const productContainer = document.getElementById("product-list");
        productContainer.innerHTML = ""; // Xóa sản phẩm cũ

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsToShow = allProducts.slice(startIndex, endIndex);

        productsToShow.forEach(product => {
            const oldPrice = product.price + 1000000;
            const productDiv = document.createElement("div");
            productDiv.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "flex", "flex-col", "cursor-pointer");
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
            
            productDiv.addEventListener("click", function () {
                localStorage.setItem("selectedProduct", JSON.stringify(product)); // Lưu vào localStorage
                window.location.href = `detail2.html?productId=${product.id}`; // Chuyển hướng đến trang chi tiết
            });
            
            productContainer.appendChild(productDiv);
        });
    }

    function updatePagination() {
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = ""; // Xóa các nút cũ

        const totalPages = Math.ceil(allProducts.length / itemsPerPage);
        if (totalPages <= 1) return;

        const prevButton = document.createElement("button");
        prevButton.innerHTML = "&#171;";
        prevButton.classList.add("pagination-btn");
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayProducts();
                updatePagination();
            }
        });
        paginationContainer.appendChild(prevButton);

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.add("pagination-btn");
            if (i === currentPage) {
                pageButton.classList.add("active");
            }
            pageButton.addEventListener("click", () => {
                currentPage = i;
                displayProducts();
                updatePagination();
            });
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement("button");
        nextButton.innerHTML = "&#187;";
        nextButton.classList.add("pagination-btn");
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayProducts();
                updatePagination();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    fetchProducts();
});