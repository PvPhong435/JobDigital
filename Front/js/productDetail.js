let productId;
// Hàm lấy productId từ URL
function getProductIdFromURL() {
    // const params = new URLSearchParams(window.location.search);
    // const ProductId = params.get("productId") || 1;
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const ProductId = product.productID;
    console.log(product)
    console.log(ProductId)
    return ProductId;
}

// Khi DOM đã sẵn sàng, thực hiện gọi API và cập nhật dữ liệu
document.addEventListener("DOMContentLoaded", function () {
    const productId = getProductIdFromURL();
    if (!productId) {
        console.error("Không tìm thấy productId");
        return;
    }

    fetch(`http://localhost:8080/api/products/${productId}`) // API lấy thông tin sản phẩm
        .then(response => response.json())
        .then(product => {
            if (!product) {
                console.error("Sản phẩm không tồn tại");
                return;
            }
            
            // Cập nhật thông tin sản phẩm
            document.querySelector("#product-name").innerText = product.productName;
            document.querySelector(".text-gray-500.line-through").innerText = `${(product.price + 1000000).toLocaleString()}₫`;
            document.querySelector(".text-red-500.text-2xl.font-bold.ml-2").innerText = `${product.price.toLocaleString()}₫`;
            document.querySelector(".mt-4.text-gray-700").innerText = product.description;

            // Cập nhật hình ảnh chính
            const mainImage = document.querySelector(".w-full.rounded-lg");
            mainImage.src = `/img/${product.imageURL}`;
            mainImage.alt = product.productName;

            // Cập nhật ảnh nhỏ (nếu có)
            const thumbnailsContainer = document.querySelector(".flex.mt-4.space-x-2");
            thumbnailsContainer.innerHTML = ""; // Xóa ảnh mẫu

            if (product.thumbnails && product.thumbnails.length > 0) {
                product.thumbnails.forEach(thumb => {
                    const imgElement = document.createElement("img");
                    imgElement.src = `/img/${thumb}`;
                    imgElement.alt = "Product thumbnail";
                    imgElement.className = "w-20 h-20 rounded-lg";
                    imgElement.width = 100;
                    imgElement.height = 100;
                    thumbnailsContainer.appendChild(imgElement);
                });
            }
            productId=product.productID;
            console.log(productId);

            // Cập nhật hành động mua hàng
            document.querySelector("#buy-now-btn").addEventListener("click", function () {
                alert(`Mua ngay: ${product.productName}`);
                // Thêm logic thanh toán
            });

            document.querySelector(".bg-gray-200").addEventListener("click", function () {
                alert(`Đã thêm ${product.productName} vào giỏ hàng!`);
                // Thêm logic thêm vào giỏ hàng
            });

            fetchSimilarProducts(productId);
        })
        .catch(error => console.error("Lỗi khi tải chi tiết sản phẩm:", error));


        document.getElementById("buy-now-btn").addEventListener("click", function () {
            let userID = document.getElementById("user-id").innerText;  // Lấy từ session hoặc biến toàn cục
            let productID = productId; // Lấy từ sản phẩm hiển thị
            let quantity = 1; // Mặc định là 1 hoặc lấy từ input số lượng
        
            addCart(userID, productID, quantity);
        });
});

// Hàm gọi API để lấy sản phẩm tương tự
function fetchSimilarProducts(productId) {
    fetch(`http://localhost:8080/api/products/productCategory/${productId}`)
        .then(response => response.json())
        .then(products => {
            const similarProductsContainer = document.getElementById("similar-products");
            similarProductsContainer.innerHTML = ""; // Xóa nội dung cũ nếu có

            products.slice(0, 3).forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "cursor-pointer");
                productDiv.dataset.productId = product.id; // Gán productId vào dataset

                productDiv.innerHTML = `
                    <img src="/img/${product.imageURL}" alt="${product.imageURL}" 
                        class="w-full h-48 object-cover mb-4 rounded-lg" width="300" height="300"/>
                    <h3 class="mt-2 text-gray-800 font-bold">${product.productName}</h3>
                    <div class="flex items-center mt-2">
                        <span class="text-gray-500 line-through">${(product.price + 1000000).toLocaleString()}₫</span>
                        <span class="text-red-500 text-xl font-bold ml-2">${product.price.toLocaleString()}₫</span>
                    </div>
                    <button class="bg-[#96644b] text-white px-4 py-2 rounded-lg mt-4 w-full">
                        MUA NGAY
                    </button>
                    <p class="text-center text-sm text-yellow-500 mt-2">Thêm vào giỏ hàng</p>
                `;

                // Sự kiện click để chuyển đến trang chi tiết sản phẩm
                productDiv.addEventListener("click", function () {
                    localStorage.setItem("selectedProduct", JSON.stringify(product)); // Lưu sản phẩm vào localStorage
                    window.location.href = `detail2.html?productId=${product.id}`; // Chuyển trang
                });

                similarProductsContainer.appendChild(productDiv);
            });
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm tương tự:", error));
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



