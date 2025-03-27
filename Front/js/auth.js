
document.addEventListener("DOMContentLoaded", function () {
    const user = localStorage.getItem("user");

    if (user) {
        const userData = JSON.parse(user); // Chuyển chuỗi JSON thành object

        // Hiển thị thông tin user
        document.getElementById("user-id").innerText = `User ID: ${userData.userid}`;
        document.getElementById("user-name").innerText = `Username: ${userData.username}`;

        // Ẩn nút "Đăng nhập", hiển thị thông tin user
        document.getElementById("login-link").style.display = "none";
        document.getElementById("user-info").style.display = "block";
    } else {
        // Nếu chưa đăng nhập, hiển thị "Đăng nhập"
        document.getElementById("login-link").style.display = "block";
        document.getElementById("user-info").style.display = "none";
    }

      // Xử lý sự kiện khi người dùng submit form
  document.getElementById('register-button').addEventListener('click', function (event) {
    event.preventDefault();  // Ngừng hành động mặc định của form (submit)
    registerUser();  // Gọi hàm đăng ký người dùng
  });
});

// Kiểm tra token để duy trì trạng thái đăng nhập
window.onload = function () {
    const token = localStorage.getItem('authToken');
    if (token) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
    }
};


// Đăng nhập
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn chặn form submit mặc định

        // Lấy dữ liệu từ input
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Kiểm tra nếu chưa nhập email hoặc password
        if (!email || !password) {
            alert("Vui lòng nhập email và mật khẩu!");
            return;
        }

        // Tạo object chứa dữ liệu gửi đi
        const requestData = {
            email: email,
            password: password
        };

        try {
            // Gửi request đăng nhập
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json(); // Chuyển response thành JSON

            if (response.ok) {
                alert("Đăng nhập thành công!");

                // Lưu token nếu API trả về
                if (result.token) {
                    localStorage.setItem("token", result.token);
                }
                // Lưu thông tin user vào localStorage
                if (result.user) {
                    localStorage.setItem("user", JSON.stringify(result.user));
                    localStorage.setItem("userId", result.user.userid);
                    localStorage.setItem("userName", result.user.username);
                }
                else {
                    const userGuest =
                    {
                        address: "unknow address",
                        createdAt: "2025-03-24 19:00:33.6351",
                        email: "guest@gmail.com",
                        fullName: "Guest",
                        password: "123",
                        phone: "0333002648",
                        role: "Customer",
                        userID: "8",
                        username: "Guest",

                    }

                    localStorage.setItem("user", JSON.stringify(userGuest));
                    localStorage.setItem("userId", result.user.userid);
                    localStorage.setItem("userName", result.user.username);
                }
                // Chuyển hướng đến trang home2.html
                window.location.href = "/ui/home2.html";
            } else {
                alert(result.message || "Đăng nhập thất bại!");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại sau!");
        }
    });
});

