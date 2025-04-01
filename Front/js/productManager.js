// DOM Elements
const addProductBtn = document.getElementById('addProductBtn');
const popupForm = document.getElementById('popup-form');
const closePopup = document.getElementById('closePopup');
const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');
const categorySelect = document.getElementById('categoryId');
const imageFileInput = document.getElementById('imageFile');
const imageFileName = document.getElementById('imageFileName');

// API Endpoints
const API_BASE_URL = 'http://localhost:8080/api/products';
const CATEGORY_API_URL = 'http://localhost:8080/api/category/admin';

// Lấy danh sách danh mục và điền vào combobox
async function loadCategories() {
    try {
        const response = await fetch(CATEGORY_API_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const categories = await response.json();
        categorySelect.innerHTML = ''; // Xóa các option cũ
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.categoryId;
            option.textContent = category.categoryName;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
    }
}

// Hiển thị danh sách sản phẩm
async function renderProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const products = await response.json();
        products.sort((a, b) => a.productId - b.productId); // Sắp xếp theo productId
        productTableBody.innerHTML = '';
        products.forEach(product => {
            console.log(product);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="py-3 px-4">${product.productId}</td>
                <td class="py-3 px-4">${product.productName}</td>
                <td class="py-3 px-4">${product.categoryName}</td>
                <td class="py-3 px-4">${Number(product.price).toLocaleString('vi-VN')}</td>
                <td class="py-3 px-4">${product.stock}</td>
                <td class="py-3 px-4">${product.description}</td>
                <td class="py-3 px-4"><img src="/img/${product.imageUrl}" alt="${product.productName}" class="h-10 w-10 object-cover"></td>
                <td class="py-3 px-4">${product.createdAt ? new Date(product.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                <td class="py-3 px-4">
                    <button class="edit-btn bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-1 rounded mr-2" data-id="${product.productId}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded" data-id="${product.productId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    }
}

// Mở popup để thêm sản phẩm
addProductBtn.addEventListener('click', () => {
    popupForm.classList.remove('hidden');
    productForm.reset();
    document.getElementById('productId').value = '';
    imageFileName.textContent = 'Không có tệp nào được chọn'; // Đặt mặc định
});

// Đóng popup
closePopup.addEventListener('click', () => {
    popupForm.classList.add('hidden');
});

// Hiển thị tên file khi chọn hình ảnh
imageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        imageFileName.textContent = file.name;
    } else {
        imageFileName.textContent = 'Không có tệp nào được chọn';
    }
});

// Xử lý submit form (thêm hoặc sửa sản phẩm)
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productId = document.getElementById('productId').value;
    const formData = new FormData();
    formData.append('productName', document.getElementById('productName').value);
    formData.append('categoryId', parseInt(document.getElementById('categoryId').value));
    formData.append('price', parseFloat(document.getElementById('price').value));
    formData.append('stock', parseInt(document.getElementById('stock').value));
    formData.append('description', document.getElementById('description').value);
    if (imageFileInput.files[0]) {
        formData.append('imageFile', imageFileInput.files[0]);
    }

    try {
        if (productId) {
            // Sửa sản phẩm
            await fetch(`${API_BASE_URL}/admin/${productId}`, {
                method: 'PUT',
                body: formData
            });
            alert('Sửa sản phẩm thành công!'); // Thông báo sửa thành công
        } else {
            // Thêm sản phẩm mới
            await fetch(`${API_BASE_URL}/admin`, {
                method: 'POST',
                body: formData
            });
            alert('Thêm sản phẩm thành công!'); // Thông báo thêm thành công
        }
        renderProducts();
        popupForm.classList.add('hidden');
    } catch (error) {
        console.error('Lỗi khi lưu sản phẩm:', error);
        alert('Có lỗi xảy ra: ' + error.message); // Thông báo lỗi
    }
});

// Xử lý sửa và xóa sản phẩm
productTableBody.addEventListener('click', async (e) => {
    const id = e.target.closest('button').dataset.id;
    if (e.target.closest('.edit-btn')) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const product = await response.json();
            console.log('Product data:', product); // Debug dữ liệu trả về
            popupForm.classList.remove('hidden');
            document.getElementById('productId').value = product.productId;
            document.getElementById('productName').value = product.productName;
            document.getElementById('categoryId').value = product.categoryId ? product.categoryId : '';
            document.getElementById('price').value = product.price;
            document.getElementById('stock').value = product.stock;
            document.getElementById('description').value = product.description;
            imageFileName.textContent = product.imageUrl ? product.imageUrl : 'Không có tệp nào được chọn';
        } catch (error) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            alert('Có lỗi xảy ra khi lấy thông tin sản phẩm: ' + error.message); // Thông báo lỗi
        }
    } else if (e.target.closest('.delete-btn')) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                alert('Xóa sản phẩm thành công!'); // Thông báo xóa thành công
                renderProducts();
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm: ' + error.message); // Thông báo lỗi
            }
        }
    }
});

// Khởi chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    renderProducts();
});