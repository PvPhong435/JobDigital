
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        console.error("Không tìm thấy ô input tìm kiếm!");
        return;
    }

    function searchProduct() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm === "") {
            fetchProducts(); // Gọi API lấy toàn bộ sản phẩm nếu ô input rỗng
            return;
        }

        // Nếu đang ở home2 thì chuyển hướng
        if (!window.location.href.includes("shop2Product.html")) {
            window.location.href = `shop2Product.html?search=${encodeURIComponent(searchTerm)}`;
            return;
        }

        // Nếu đang ở shop2Product thì gọi API tìm kiếm
        fetch(`http://localhost:8080/api/products/findByName/${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(products => {
                console.log("Sản phẩm tìm được:", products);
                allProducts = products;
                currentPage = 1;
                displayProducts();
            })
            .catch(error => console.error("Lỗi khi tìm kiếm sản phẩm:", error));
    }

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchProduct();
        }
    });

    // Nếu đang ở shop2Product, lấy từ URL và tìm kiếm sau khi trang đã tải xong
    if (window.location.href.includes("shop2Product.html")) {
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const searchTerm = urlParams.get("search");
            if (searchTerm) {
                searchInput.value = searchTerm;
                searchProduct();
            }
        }, 500); // Đợi 0.5s để đảm bảo DOM đã load xong
    }
});
