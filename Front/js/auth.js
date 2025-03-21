// // Đăng ký tài khoản (POST)
// document.getElementById('register-form').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const username = document.getElementById('register-username').value;
//     const password = document.getElementById('register-password').value;

//     const newUser = { username, password };

//     fetch('http://localhost:8080/api/auth/register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newUser)
//     })
//         .then(response => response.json())
//         .then(data => {
//             alert('Đăng ký thành công!');
//             document.getElementById('register-username').value = '';
//             document.getElementById('register-password').value = '';
//         })
//         .catch(error => console.error('Có lỗi khi đăng ký:', error));
// });

// // Đăng nhập (POST)
// document.getElementById('login-form').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const username = document.getElementById('login-username').value;
//     const password = document.getElementById('login-password').value;

//     const userCredentials = { username, password };

//     fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(userCredentials)
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.token) {
//                 // Lưu token vào localStorage
//                 localStorage.setItem('authToken', data.token);

//                 // Hiển thị nút đăng xuất và ẩn các form đăng ký, đăng nhập
//                 document.getElementById('login-form').style.display = 'none';
//                 document.getElementById('register-form').style.display = 'none';
//                 document.getElementById('logout-btn').style.display = 'block';
//             } else {
//                 alert('Đăng nhập không thành công!');
//             }
//         })
//         .catch(error => console.error('Có lỗi khi đăng nhập:', error));
// });

// // Đăng xuất (POST)
// document.getElementById('logout-btn').addEventListener('click', function() {
//     fetch('http://localhost:8080/api/auth/logout', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Gửi token khi đăng xuất
//         }
//     })
//         .then(() => {
//             // Xóa token trong localStorage và ẩn nút đăng xuất
//             localStorage.removeItem('authToken');
//             document.getElementById('login-form').style.display = 'block';
//             document.getElementById('register-form').style.display = 'block';
//             document.getElementById('logout-btn').style.display = 'none';
//         })
//         .catch(error => console.error('Có lỗi khi đăng xuất:', error));
// });



// // Kiểm tra token để duy trì trạng thái đăng nhập
// window.onload = function() {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//         document.getElementById('login-form').style.display = 'none';
//         document.getElementById('register-form').style.display = 'none';
//         document.getElementById('logout-btn').style.display = 'block';
//     }
// };


// //Đăng nhập
// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("login-form").addEventListener("submit", async function (event) {
//       event.preventDefault(); // Ngăn chặn form submit mặc định
  
//       // Lấy dữ liệu từ input
//       const email = document.getElementById("email").value.trim();
//       const password = document.getElementById("password").value.trim();
  
//       // Kiểm tra nếu chưa nhập email hoặc password
//       if (!email || !password) {
//         alert("Vui lòng nhập email và mật khẩu!");
//         return;
//       }
  
//       // Tạo object chứa dữ liệu gửi đi
//       const requestData = {
//         email: email,
//         password: password
//       };
  
//       try {
//         // Gửi request đăng nhập
//         const response = await fetch("http://localhost:8080/api/auth/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(requestData)
//         });
  
//         const result = await response.json(); // Chuyển response thành JSON
  
//         if (response.ok) {
//           alert("Đăng nhập thành công!");
//           // Lưu token nếu API trả về
//           if (result.token) {
//             localStorage.setItem("token", result.token);
//           }
//           // Chuyển hướng đến trang chính
//           window.location.href = "/dashboard.html"; // Thay bằng trang bạn muốn chuyển tới
//         } else {
//           alert(result.message || "Đăng nhập thất bại!");
//         }
//       } catch (error) {
//         console.error("Lỗi đăng nhập:", error);
//         alert("Có lỗi xảy ra, vui lòng thử lại sau!");
//       }
//     });
//   });
  