let OtpCode;
let user;
let email;
document.addEventListener("DOMContentLoaded", function () {
    OtpCode = localStorage.getItem("verificationCode");
    email = localStorage.getItem("userEmail"); // Lưu email người dùng
    user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    console.log(OtpCode);

    document.getElementById('verify-button').addEventListener('click', function () {
        const code = document.getElementById('verification-code').value.trim();

        if (!code) {
            alert("Vui lòng nhập mã xác thực!");
            location.reload();
        }
        else if (code !== OtpCode) {
            alert("mã otp không trùng khớp vui lòng kiểm tra lại mail");
            location.reload();
        }
        else {
            window.location.href = 'changeNewPass.html';
        }
    });

    // Xử lý gửi lại mã xác thực
    document.getElementById('resend-code').addEventListener('click', function () {
        sendOTPtoEmailAgain(user,email);
    });
});

function sendOTPtoEmailAgain(user,email)
{
    if (user) {
        // Tạo mã xác thực ngẫu nhiên 6 chữ số
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Lưu mã xác thực vào localStorage (để kiểm tra sau khi người dùng nhập)
        localStorage.setItem('verificationCode', verificationCode);
        localStorage.setItem('userEmail', email); // Lưu email người dùng
        // Gửi mã xác thực đến server
        const data = {
            email: email,
            otp: String(verificationCode),
        };
        console.log(data);
        fetch('http://localhost:8080/api/password-reset/sendVerificationCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    alert("Gửi mã xác thực không thành công");
                    console.log(response);
                    // throw new Error('Gửi mã xác thực không thành công!');
                }
                else
                {
                    alert("Gửi lại mã xác thực thành công");
                    location.reload();
                }
                // Chuyển đến trang nhập mã xác thực
                
            })
            .catch(error => {
                console.log(error)
                console.error('Có lỗi xảy ra khi gửi mã:', error.message);
            });
    }
}