document.addEventListener("DOMContentLoaded", function () {
  convertPassword();
    // Xử lý sự kiện khi người dùng submit form
    document.getElementById('register-button').addEventListener('click', function () {
      registerUser();  // Gọi hàm đăng ký người dùng
    });
    
});



// Hàm đăng ký người dùng
function registerUser() {
  console.log("đăng ký")
    // Lấy dữ liệu từ các ô input
    const userData = {
      username: document.getElementById('user-username').value,
      password: document.getElementById('user-password').value,
      role: document.getElementById('user-role').value,
      fullName: document.getElementById('user-fullname').value,
      address: document.getElementById('user-address').value,
      phone: document.getElementById('user-phone').value,
      email: document.getElementById('user-email').value,
      createdAt: getFormattedDate()
    };

    // Kiểm tra xem có trường nào bị bỏ trống không
    for (let key in userData) {
      if (userData[key] === "" || userData[key] === null) {
          alert("Vui lòng nhập đầy đủ thông tin trước khi đăng ký!");
          return; // Dừng lại nếu phát hiện trường bị bỏ trống
      }
    }
  
    // Gửi yêu cầu POST đến API đăng ký
    fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  // Chỉ định kiểu dữ liệu gửi đi là JSON
      },
      body: JSON.stringify(userData)  // Chuyển đối tượng JavaScript thành chuỗi JSON
    })
      .then(response => {
        if (!response.ok) {
          // Nếu phản hồi không thành công (lỗi 4xx, 5xx)
          throw new Error('Đăng ký không thành công!');
        }
        else
        {
          alert("Đăng Ký Thành Công");
          window.location.href = "home2.html";
        }
        return response.json();  // Chuyển phản hồi từ server thành JSON
      })
      .then(data => {
        // Sau khi nhận được phản hồi từ server, lưu thông tin người dùng vào localStorage
        localStorage.setItem('user', JSON.stringify(data));  // Lưu dữ liệu vào localStorage
        console.log('Đăng ký thành công:', data);

      })
      .catch(error => {
        console.error('Có lỗi xảy ra:', error);
      });
}

function convertPassword()
{
  document.getElementById('toggle-password').addEventListener('click', function () {
    let passwordInput = document.getElementById('user-password');
    let icon = this.querySelector('img');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.src = "https://cdn-icons-png.flaticon.com/512/2767/2767141.png"; // Icon "ẩn"
    } else {
        passwordInput.type = 'password';
        icon.src = "https://cdn-icons-png.flaticon.com/512/2767/2767146.png"; // Icon "hiện"
    }
});
}

function getFormattedDate() {
  const now = new Date();
  return now.toISOString().slice(0, -1); // Chuyển sang ISO 8601 và loại bỏ 'Z' để phù hợp với LocalDateTime
}
  

