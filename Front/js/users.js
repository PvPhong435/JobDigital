// Lấy tất cả người dùng
function fetchUsers() {
    fetch('http://localhost:8080/api/users')
        .then(response => response.json())
        .then(data => {
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';  // Xóa dữ liệu cũ

            data.forEach(user => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = user.id; // Giả sử ID là một thuộc tính trong dữ liệu
                row.appendChild(idCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = user.name;
                row.appendChild(nameCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                row.appendChild(emailCell);

                const roleCell = document.createElement('td');
                roleCell.textContent = user.role;
                row.appendChild(roleCell);

                // Thêm các nút hành động: sửa và xóa
                const actionCell = document.createElement('td');
                
                // Nút sửa
                const editButton = document.createElement('button');
                editButton.textContent = 'Sửa';
                editButton.onclick = () => updateUser(user.id);
                actionCell.appendChild(editButton);

                // Nút xóa
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Xóa';
                deleteButton.onclick = () => deleteUser(user.id);
                actionCell.appendChild(deleteButton);

                row.appendChild(actionCell);
                userList.appendChild(row);
            });
        })
        .catch(error => console.error('Có lỗi xảy ra:', error));
}

// Thêm người dùng mới (POST)
document.getElementById('add-user-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    const newUser = { name, email, role };

    fetch('http://localhost:8080/api/users/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
        .then(response => response.json())
        .then(data => {
            fetchUsers(); // Cập nhật lại danh sách người dùng
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('role').value = '';
        })
        .catch(error => console.error('Có lỗi khi thêm người dùng:', error));
});

// Cập nhật thông tin người dùng (PUT)
function updateUser(userId) {
    const name = prompt('Nhập tên người dùng mới:');
    const email = prompt('Nhập email người dùng mới:');
    const role = prompt('Nhập vai trò người dùng mới:');

    const updatedUser = { name, email, role };

    fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => response.json())
        .then(() => fetchUsers()) // Cập nhật lại danh sách người dùng
        .catch(error => console.error('Có lỗi khi sửa người dùng:', error));
}

// Xóa người dùng (DELETE)
function deleteUser(userId) {
    fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE'
    })
        .then(() => fetchUsers()) // Cập nhật lại danh sách người dùng
        .catch(error => console.error('Có lỗi khi xóa người dùng:', error));
}

// Lấy thông tin người dùng theo ID (GET)
function fetchUserById(userId) {
    fetch(`http://localhost:8080/api/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Thông tin người dùng:', data);
        })
        .catch(error => console.error('Có lỗi xảy ra khi lấy thông tin người dùng:', error));
}

// Tải danh sách người dùng khi trang được tải
fetchUsers();
