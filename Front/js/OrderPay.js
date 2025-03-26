let user;
let productList;
let order;

document.addEventListener("DOMContentLoaded", function () {
    user = JSON.parse(localStorage.getItem("user"));
    LoadDuLieuHienThi();
});

async function datHang() {
    const userInfor = {
        userName: document.getElementById("hoTen").value,
        phone: document.getElementById("sdt").value,
        email: document.getElementById("Email").value,
        address: document.getElementById("DiaChi").value,
        userId: document.getElementById("user-Id").innerText
    };

    // Thêm order mới
    try {
        addOrder();
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi khi thêm order mới")
    }

    // // Tạo thông tin đơn hàng
    // order = {
    //     userId: userInfor.userId,
    //     orderDate: new Date().toISOString().replace("T", " ").substring(0, 19), // Định dạng thời gian chuẩn
    //     totalAmount: productList.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    //     status: "Pending",
    //     products: productList
    // };

    // try {
    //     // Gửi đơn hàng lên Backend
    //     const response = await fetch("http://localhost:8080/api/order/create", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(order)
    //     });

    //     if (!response.ok) throw new Error("Lỗi khi tạo đơn hàng!");

    //     localStorage.removeItem("productList");

    //     // Gửi email xác nhận đơn hàng
    //     const emailResponse = await fetch(`http://localhost:8080/api/email/send?to=${userInfor.email}&subject=Đơn hàng của bạn&text=Đơn hàng đã đặt thành công!`);
    //     if (!emailResponse.ok) throw new Error("Lỗi khi gửi email!");

    //     alert("Đơn hàng đã được đặt và email xác nhận đã gửi!");
    //     window.location.href = "Order.html"; // Chuyển trang sau khi đặt hàng thành công
    // } catch (error) {
    //     console.error("Lỗi:", error);
    //     alert("Đặt hàng thất bại!");
    // }
}

function LoadDuLieuHienThi() {
    // Lấy danh sách sản phẩm từ localStorage
    productList = JSON.parse(localStorage.getItem("productList")) || [];
    console.log("Danh sách sản phẩm:", productList);

    // Lấy thông tin đơn hàng từ localStorage
    order = JSON.parse(localStorage.getItem("order")) || null;
    console.log("Thông tin đơn hàng:", order);

    if (user && user.userID !== 8) {
        document.getElementById("hoTen").value = user.fullName || "";
        document.getElementById("sdt").value = user.phone || "";
        document.getElementById("Email").value = user.email || "";
        document.getElementById("DiaChi").value = user.address || "";
        document.getElementById("user-Id").innerText = user.userID;
    }
}

async function addOrder() {
    console.log(order)
    try {
        const response = await fetch("http://localhost:8080/api/orders/addOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        });
        let orderAdd;
        if (!response.ok) {
            throw new Error("Thêm order thất bại, đã xảy ra lỗi!");
        }
        else
        {
            const formattedProductList = productList.map(product => ({
                productId: Number(product.productId), // Chuyển productId thành số
                quantity: product.quantity,
                price: product.price
            }));
            
            console.log("📤 Dữ liệu gửi lên BE:", formattedProductList);
            
            if (formattedProductList.some(p => isNaN(p.productId))) {
                console.error("🚨 Lỗi: Có sản phẩm bị thiếu hoặc sai kiểu productId!", formattedProductList);
                alert("Lỗi: Có sản phẩm bị thiếu hoặc sai kiểu productId!");
                return;
            }
            orderAdd = await response.json(); // Nhận dữ liệu trả về từ BE
            // Gọi hàm thêm chi tiết đơn hàng
            addOrderDetail(orderAdd.orderID,formattedProductList);
        }

        

        // Lưu vào localStorage để sử dụng sau này (nếu cần)
        localStorage.setItem("orderAdd", JSON.stringify(orderAdd));
        console.log(orderAdd);
        
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi khi đặt hàng!");
    }
}

async function addOrderDetail(orderID, productList) {
    try {
        const response = await fetch(`http://localhost:8080/api/orders/addOrderDetail/${orderID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productList),
        });

        if (!response.ok) throw new Error("Lỗi khi thêm OrderDetail!");
        else
        {
            alert("Thanh toán thành công");
        }

        const result = await response.json();
    } catch (error) {
        console.error("❌ Lỗi:", error);
        alert("Lỗi khi thêm OrderDetail!");
    }
}


