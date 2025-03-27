document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('verify-button').addEventListener('click', function () {
        const code = document.getElementById('verification-code').value.trim();

        if (!code) {
            alert("Vui lòng nhập mã xác thực!");
            return;
        }

        // Gửi mã xác thực lên server
        fetch("http://localhost:8080/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Xác thực thành công! Chuyển hướng về trang đăng nhập...");
                window.location.href = "login.html"; // Chuyển hướng đến trang đăng nhập
            } else {
                alert("Mã xác thực không đúng, vui lòng thử lại!");
            }
        })
        .catch(error => console.error("Lỗi:", error));
    });

    // Xử lý gửi lại mã xác thực
    document.getElementById('resend-code').addEventListener('click', function () {
        fetch("http://localhost:8080/api/auth/resend", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            alert("Mã xác thực mới đã được gửi!");
        })
        .catch(error => console.error("Lỗi:", error));
    });
});

function KiemTraXacThuc()
{
    
}