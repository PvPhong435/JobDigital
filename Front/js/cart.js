// Lấy giỏ hàng của người dùng (GET)
function fetchCart(userId) {
    fetch(`http://localhost:8080/api/cart/user/${userId}`)
        .then(response => response.json())
        .then(data => {
            const cartList = document.getElementById('cart-list');
            cartList.innerHTML = '';  // Xóa dữ liệu cũ

            data.forEach(cartItem => {
                const row = document.createElement('tr');

                const cartIdCell = document.createElement('td');
                cartIdCell.textContent = cartItem.cartId; // Giả sử cartId là thuộc tính của giỏ hàng
                row.appendChild(cartIdCell);

                const productIdCell = document.createElement('td');
                productIdCell.textContent = cartItem.productId;
                row.appendChild(productIdCell);

                const quantityCell = document.createElement('td');
                quantityCell.textContent = cartItem.quantity;
                row.appendChild(quantityCell);

                // Thêm nút hành động: cập nhật và xóa
                const actionCell = document.createElement('td');
                
                // Nút cập nhật
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Cập nhật';
                updateButton.onclick = () => updateCartItem(cartItem.cartId);
                actionCell.appendChild(updateButton);

                // Nút xóa
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Xóa';
                deleteButton.onclick = () => deleteCartItem(cartItem.cartId);
                actionCell.appendChild(deleteButton);

                row.appendChild(actionCell);
                cartList.appendChild(row);
            });
        })
        .catch(error => console.error('Có lỗi xảy ra:', error));
}

// Thêm sản phẩm vào giỏ hàng (POST)
document.getElementById('add-to-cart-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;
    const productId = document.getElementById('productId').value;
    const quantity = document.getElementById('quantity').value;

    const newCartItem = { userId, productId, quantity };

    fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCartItem)
    })
        .then(response => response.json())
        .then(data => {
            fetchCart(userId); // Cập nhật lại giỏ hàng
            document.getElementById('userId').value = '';
            document.getElementById('productId').value = '';
            document.getElementById('quantity').value = '';
        })
        .catch(error => console.error('Có lỗi khi thêm sản phẩm vào giỏ hàng:', error));
});

// Cập nhật số lượng sản phẩm trong giỏ hàng (PUT)
function updateCartItem(cartId) {
    const quantity = prompt('Nhập số lượng mới:');

    const updatedCartItem = { cartId, quantity };

    fetch(`http://localhost:8080/api/cart/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCartItem)
    })
        .then(response => response.json())
        .then(() => fetchCart(updatedCartItem.userId)) // Cập nhật lại giỏ hàng
        .catch(error => console.error('Có lỗi khi cập nhật giỏ hàng:', error));
}

// Xóa sản phẩm khỏi giỏ hàng (DELETE)
function deleteCartItem(cartId) {
    fetch(`http://localhost:8080/api/cart/delete/${cartId}`, {
        method: 'DELETE'
    })
        .then(() => fetchCart()) // Cập nhật lại giỏ hàng
        .catch(error => console.error('Có lỗi khi xóa sản phẩm khỏi giỏ hàng:', error));
}

// Lấy thông tin giỏ hàng theo ID (GET)
function fetchCartById(cartId) {
    fetch(`http://localhost:8080/api/cart/${cartId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Thông tin giỏ hàng:', data);
        })
        .catch(error => console.error('Có lỗi xảy ra khi lấy thông tin giỏ hàng:', error));
}

// Tải giỏ hàng của người dùng khi trang được tải
const userId = 1; // Ví dụ, lấy giỏ hàng của người dùng có ID là 1
fetchCart(userId);
