document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://localhost:8080/api/users";
    const userTableBody = document.getElementById("userTableBody");
    const userForm = document.getElementById("userForm");
    const popupForm = document.getElementById("popup-form");
    let editingUserId = null;

    // Hàm lấy danh sách người dùng
    async function fetchUsers() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Không thể lấy danh sách người dùng");
            
            const data = await response.json();
            userTableBody.innerHTML = "";
            data.forEach(user => {
                const row = document.createElement("tr");
                row.classList.add("border-b", "hover:bg-gray-100");
                row.innerHTML = `
                    <td class="py-3 px-6">${user.userID}</td>
                    <td class="py-3 px-6">${user.username}</td>
                    <td class="py-3 px-6">${user.email}</td>
                    <td class="py-3 px-6">${user.fullName}</td>
                    <td class="py-3 px-6">${user.phone || "N/A"}</td>
                    <td class="py-3 px-6">${user.address || "N/A"}</td>
                    <td class="py-3 px-6">${user.role}</td>
                    <td class="py-3 px-6">${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td class="py-3 px-6 flex space-x-2">
                        <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center" onclick="editUser(${user.userID})">
                            <i class="fas fa-edit mr-1"></i> Sửa
                        </button>
                        <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center" onclick="deleteUser(${user.userID})">
                            <i class="fas fa-trash-alt mr-1"></i> Xóa
                        </button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            alert("Lỗi khi tải danh sách người dùng!");
        }
    }

    // Hàm chỉnh sửa người dùng
    window.editUser = async function (userID) {
        try {
            const response = await fetch(`${apiUrl}/${userID}`);
            if (!response.ok) throw new Error("Không thể tải dữ liệu người dùng");

            const user = await response.json();
            document.getElementById("username").value = user.username;
            document.getElementById("email").value = user.email;
            document.getElementById("fullName").value = user.fullName;
            document.getElementById("phone").value = user.phone || "";
            document.getElementById("address").value = user.address || "";
            document.getElementById("role").value = user.role;

            editingUserId = userID;
            popupForm.classList.remove("hidden");
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
            alert("Không thể tải dữ liệu người dùng!");
        }
    };

    // Hàm xóa người dùng
    window.deleteUser = async function (userID) {
        if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${userID}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Xóa thất bại!");

                alert("Xóa người dùng thành công!");
                fetchUsers();
            } catch (error) {
                console.error("Lỗi khi xóa người dùng:", error);
                alert("Xóa người dùng thất bại!");
            }
        }
    };

    // Xử lý submit form để thêm/cập nhật người dùng
    userForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const userData = {
            username: document.getElementById("username").value.trim(),
            email: document.getElementById("email").value.trim(),
            fullName: document.getElementById("fullName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            role: document.getElementById("role").value,
        };

        const method = editingUserId ? "PUT" : "POST";
        const url = editingUserId ? `${apiUrl}/${editingUserId}` : `${apiUrl}/addUser`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error("Cập nhật thất bại!");

            alert(editingUserId ? "Cập nhật người dùng thành công!" : "Thêm người dùng thành công!");
            popupForm.classList.add("hidden");
            fetchUsers();
            editingUserId = null;
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error);
            alert("Lưu người dùng thất bại!");
        }
    });

    // Đóng form popup
    document.getElementById("closePopup").addEventListener("click", function () {
        popupForm.classList.add("hidden");
        editingUserId = null;
    });

    // Load danh sách người dùng khi trang được tải
    fetchUsers();
    let user=localStorage.getItem("user");
    user = JSON.parse(user);
    console.log("thông tin user"+user);
    if (user.role === "Employee") {
        const elements = document.getElementsByClassName("doanhthu");
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
    }
});
