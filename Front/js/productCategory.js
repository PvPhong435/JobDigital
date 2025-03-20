// async function fetchProductsByCategory(categoryId) {
//     try {
//         const response = await fetch(`http://localhost:8080/api/products/category/${categoryId}`);
//         if (!response.ok) {
//             throw new Error("Không thể tải danh sách sản phẩm");
//         }
//         const products = await response.json();
//         renderProducts(products);
//     } catch (error) {
//         console.error("Lỗi:", error);
//     }
// }

// function renderProducts(products) {
//     const productList = document.getElementById("product-list");
//     productList.innerHTML = ""; // Xóa sản phẩm cũ

//     if (products.length === 0) {
//         productList.innerHTML = `<p class="text-center text-gray-500">Không có sản phẩm nào</p>`;
//         return;
//     }

//     products.forEach(product => {
//         productList.innerHTML += `
//             <div class="border rounded-lg p-4 h-full">
//                 <div class="relative">
//                     <img alt="${product.name}" class="w-full h-48 object-cover rounded-lg" 
//                          src="${product.image || 'https://via.placeholder.com/600x400'}"/>
//                     ${product.discount > 0 ? `<span class="absolute top-2 left-2 bg-[#a58762] text-white text-xs px-2 py-1 rounded">Giảm giá</span>` : ''}
//                 </div>
//                 <div class="mt-4">
//                     <h3 class="text-sm text-gray-500">${product.categoryName.toUpperCase()}</h3>
//                     <p class="text-lg font-bold truncate-2-lines">${product.name}</p>
//                     ${product.discount > 0 ? `<p class="text-sm text-gray-500 line-through">${product.originalPrice}đ</p>` : ''}
//                     <p class="text-lg text-teal-800 font-bold">${product.price} VND</p>
//                     <button class="mt-2 w-full bg-[#96644b] text-white py-2 rounded">MUA NGAY</button>
//                     <p class="text-center text-sm text-gray-500 mt-2">Thêm vào giỏ hàng</p>
//                 </div>
//             </div>
//         `;
//     });
// }

// // Gọi API với category ID (thay số 2 bằng ID loại sản phẩm thực tế)
// const categoryId = 1; // Thay bằng ID động khi cần
// fetchProductsByCategory(categoryId);


document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get("categoryId") || 1; // Mặc định là 1 nếu không có categoryId
    fetch(`http://localhost:8080/api/products/category/${categoryId}`) // Gọi API lấy sản phẩm theo danh mục
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById("product-list");
            productContainer.innerHTML = ""; // Xóa sản phẩm cũ nếu có

            if (products.length === 0) {
                productContainer.innerHTML = `<p class="text-center text-gray-500">Không có sản phẩm nào</p>`;
                return;
            }

            products.slice(0, 8).forEach(product => {
                const oldPrice = product.price + 1000000; // Tạo giá cũ (giả lập giảm giá)

                const productHTML = `
                    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col">
                        <img src="${product.imageURL || 'https://via.placeholder.com/300'}" 
                            alt="${product.productName}" class="w-full h-48 object-cover mb-4 rounded-lg" width="300" height="300"/>
                        <p class="text-sm text-gray-600 mb-2 font-semibold">${product.productName}</p>
                        <p class="text-sm text-gray-400 line-through">${oldPrice.toLocaleString()}₫</p>
                        <p class="text-lg font-bold text-teal-800">${product.price.toLocaleString()}₫</p>
                        <p class="text-sm text-gray-500 mb-2">${product.description}</p>
                        <p class="text-sm text-gray-700">Số lượng tồn kho: ${product.stock}</p>
                        <button class="bg-[#96644b] text-white py-2 px-4 rounded mt-4 w-full">MUA NGAY</button>
                        <p class="text-center text-sm text-yellow-500 mt-2">Thêm vào giỏ hàng</p>
                    </div>
                `;
                productContainer.innerHTML += productHTML;
            });
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm:", error));
});
