let userPresent;
let user;
document.addEventListener("DOMContentLoaded", function () {
    user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    document.getElementById('change-button').addEventListener('click', function () {
        ChangePass()  // Gọi hàm thay đổi mật khẩu
    });

});


// Hàm gửi email và tạo mã xác thực
function ChangePass() {
    const passNew1 = document.getElementById('user-passwordNew').value;
    const passNew2 = document.getElementById('user-passwordNew2').value;
    const email = user.email;
    console.log(passNew1);
    console.log(passNew2);

    if (passNew1 === passNew2) {
        user.password = passNew1;
        fetch(`http://localhost:8080/api/users/${user.userID}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            })
            .then(response => {
                if (!response.ok) {
                    alert("Cập nhật mật khẩu thất bại");
                    
                }
                else {
                    alert("Cập nhật mật khẩu thành công");
                }
                return response.json();  // Chuyển dữ liệu trả về thành JSON
            })
            .then(user => {
                userPresent = user;
                localStorage.setItem("user", user);
                window.location.href = "login.html";
            })
            .catch(error => {
                console.error('Có lỗi xảy ra:', error);
            });
    }
    else {
        alert("Mật khẩu xác thực không khớp");
        location.reload();
    }


}

