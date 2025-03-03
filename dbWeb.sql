-- Tạo bảng Users
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY, -- Mã người dùng, tự động tăng
    Username VARCHAR(50) NOT NULL, -- Tên đăng nhập của người dùng
    Password VARCHAR(255) NOT NULL, -- Mật khẩu đã được mã hóa
    Email VARCHAR(100) NOT NULL, -- Email của người dùng
    FullName VARCHAR(100), -- Họ và tên đầy đủ của người dùng
    Phone VARCHAR(15), -- Số điện thoại liên hệ
    Address TEXT, -- Địa chỉ của người dùng
    Role VARCHAR(10) DEFAULT 'Customer', -- Vai trò của người dùng (Khách hàng hoặc Quản trị viên)
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời gian đăng ký tài khoản
);

-- Tạo bảng Categories
CREATE TABLE Categories (
    CategoryID SERIAL PRIMARY KEY, -- Mã danh mục sản phẩm, tự động tăng
    CategoryName VARCHAR(50) NOT NULL, -- Tên danh mục sản phẩm
    Description TEXT -- Mô tả chi tiết về danh mục
);

-- Tạo bảng Products
CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY, -- Mã sản phẩm, tự động tăng
    ProductName VARCHAR(100) NOT NULL, -- Tên sản phẩm
    CategoryID INT, -- Mã danh mục của sản phẩm
    Price NUMERIC(10, 2) NOT NULL, -- Giá của sản phẩm
    Stock INT DEFAULT 0, -- Số lượng tồn kho của sản phẩm
    Description TEXT, -- Mô tả chi tiết về sản phẩm
    ImageURL VARCHAR(255), -- Đường dẫn tới hình ảnh của sản phẩm
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian thêm sản phẩm vào hệ thống
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE SET NULL -- Liên kết tới bảng Categories
);

-- Tạo bảng Orders
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY, -- Mã đơn hàng, tự động tăng
    UserID INT, -- Mã người dùng đặt hàng
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày đặt hàng
    TotalAmount NUMERIC(10, 2) NOT NULL, -- Tổng số tiền của đơn hàng
    Status VARCHAR(15) DEFAULT 'Pending', -- Trạng thái của đơn hàng
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE -- Liên kết tới bảng Users
);

-- Tạo bảng OrderDetails
CREATE TABLE OrderDetails (
    OrderDetailID SERIAL PRIMARY KEY, -- Mã chi tiết đơn hàng, tự động tăng
    OrderID INT, -- Mã đơn hàng
    ProductID INT, -- Mã sản phẩm trong đơn hàng
    Quantity INT NOT NULL, -- Số lượng sản phẩm
    Price NUMERIC(10, 2) NOT NULL, -- Giá sản phẩm tại thời điểm mua
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE, -- Liên kết tới bảng Orders
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE -- Liên kết tới bảng Products
);

-- Tạo bảng Cart
CREATE TABLE Cart (
    CartID SERIAL PRIMARY KEY, -- Mã giỏ hàng, tự động tăng
    UserID INT, -- Mã người dùng
    ProductID INT, -- Mã sản phẩm trong giỏ hàng
    Quantity INT NOT NULL, -- Số lượng sản phẩm trong giỏ
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE, -- Liên kết tới bảng Users
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE -- Liên kết tới bảng Products
);

-- Tạo bảng Payments
CREATE TABLE Payments (
    PaymentID SERIAL PRIMARY KEY, -- Mã thanh toán, tự động tăng
    OrderID INT, -- Mã đơn hàng đã thanh toán
    PaymentMethod VARCHAR(50) NOT NULL, -- Phương thức thanh toán (ví dụ: thẻ, tiền mặt)
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày thực hiện thanh toán
    PaymentStatus VARCHAR(10) DEFAULT 'Unpaid', -- Trạng thái thanh toán
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE -- Liên kết tới bảng Orders
);

-- Tạo bảng Reviews
CREATE TABLE Reviews (
    ReviewID SERIAL PRIMARY KEY, -- Mã đánh giá sản phẩm, tự động tăng
    ProductID INT, -- Mã sản phẩm được đánh giá
    UserID INT, -- Mã người dùng thực hiện đánh giá
    Rating INT CHECK (Rating BETWEEN 1 AND 5), -- Xếp hạng sản phẩm từ 1 đến 5
    Comment TEXT, -- Nội dung đánh giá sản phẩm
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian viết đánh giá
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE, -- Liên kết tới bảng Products
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE -- Liên kết tới bảng Users
);

-- Tạo bảng ForgotPasswordTokens
CREATE TABLE ForgotPasswordTokens (
    TokenID SERIAL PRIMARY KEY, -- Mã token, tự động tăng
    UserID INT, -- Mã người dùng yêu cầu quên mật khẩu
    Token VARCHAR(255) NOT NULL, -- Chuỗi token để khôi phục mật khẩu
    Expiration TIMESTAMP NOT NULL, -- Thời gian hết hạn của token
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE -- Liên kết tới bảng Users
);

-- Tạo bảng Statistics
CREATE TABLE Statistics (
    StatisticID SERIAL PRIMARY KEY, -- Mã thống kê, tự động tăng
    Date DATE NOT NULL, -- Ngày thực hiện thống kê
    TotalSales NUMERIC(10, 2) DEFAULT 0, -- Tổng doanh thu trong ngày
    TotalOrders INT DEFAULT 0, -- Tổng số đơn hàng trong ngày
    NewCustomers INT DEFAULT 0 -- Số lượng khách hàng mới trong ngày
);
