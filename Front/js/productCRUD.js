
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
