let userPresent;
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('next-button').addEventListener('click', function () {
        sendVerificationCode()  // Gọi hàm đăng ký người dùng
    });

});


// Hàm gửi email và tạo mã xác thực
function sendVerificationCode() {

    const email = document.getElementById('user-email').value;

    if (!email) {
        alert("Vui lòng nhập email!");
        return; // Dừng hàm nếu email rỗng
    }
    // Gửi yêu cầu GET đến API để lấy thông tin người dùng theo email
    fetch(`http://localhost:8080/api/users/email/${email}`, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Không tìm thấy người dùng với email này!');
            }
            else {
                
            }
            return response.json();  // Chuyển dữ liệu trả về thành JSON
        })
        .then(user => {
            userPresent= user;
            localStorage.setItem("user",user);
            console.log(user);
            sendOTPtoEmail(user,email);
            window.location.href = "OTP.html";
        })
        .catch(error => {
            console.error('Có lỗi xảy ra:', error);
        });
       
}


function sendOTPtoEmail(user,email)
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
            verificationCode: verificationCode,
        };

        fetch('http://localhost:8080/api/password-reset/sendVerificationCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gửi mã xác thực không thành công!');
                }
                // Chuyển đến trang nhập mã xác thực
                window.location.href = 'verify-code.html';
            })
            .catch(error => {
                console.error('Có lỗi xảy ra khi gửi mã:', error);
            });
    }
}


// //Xử lý nhập mã xác thực
// // Hàm kiểm tra mã xác thực
// function verifyCode() {
//     const enteredCode = document.getElementById('user-verification-code').value;
//     const storedCode = localStorage.getItem('verificationCode'); // Mã xác thực đã tạo trước đó

//     if (enteredCode === storedCode) {
//         // Nếu mã xác thực đúng, chuyển đến trang nhập mật khẩu
//         window.location.href = 'reset-password.html';
//     } else {
//         // Nếu mã không đúng
//         alert('Mã xác thực không đúng. Vui lòng thử lại!');
//     }
// }

// // Xử lý sự kiện submit form nhập mã xác thực
// document.getElementById('verify-code-form').addEventListener('submit', function (event) {
//     event.preventDefault();  // Ngừng hành động mặc định của form
//     verifyCode();  // Kiểm tra mã xác thực
// });

// // Hàm thay đổi mật khẩu
// function resetPassword() {
//     const newPassword = document.getElementById('user-new-password').value;
//     const email = localStorage.getItem('userEmail');  // Lấy email đã lưu trong localStorage

//     const data = {
//         email: email,
//         newPassword: newPassword,
//     };

//     fetch('https://api.example.com/resetPassword', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Đặt lại mật khẩu không thành công!');
//             }
//             alert('Mật khẩu đã được thay đổi thành công!');
//             // Xóa dữ liệu khỏi localStorage sau khi thay đổi mật khẩu thành công
//             localStorage.removeItem('verificationCode');
//             localStorage.removeItem('userEmail');
//             window.location.href = 'login.html';  // Chuyển đến trang đăng nhập
//         })
//         .catch(error => {
//             console.error('Có lỗi xảy ra khi thay đổi mật khẩu:', error);
//         });
// }

// // Xử lý sự kiện submit form thay đổi mật khẩu
// document.getElementById('reset-password-form').addEventListener('submit', function (event) {
//     event.preventDefault();  // Ngừng hành động mặc định của form
//     resetPassword();  // Gọi hàm thay đổi mật khẩu
// });

