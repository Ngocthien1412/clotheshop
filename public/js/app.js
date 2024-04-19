import apiRequest from "./apirequest.js";
import user from "./user.js"
export default class App {
  
    constructor() {
      this._onLogin = this._onLogin.bind(this);
      this._onRegister = this._onRegister.bind(this);
      this._onAddProduct = this._onAddProduct.bind(this);
     
        this._loginForm = document.querySelector("#login-page form");
      this._registerForm = document.querySelector("#register-page form");
     // this._loginForm.addEventListener("submit", this._onLogin);
    //  this._registerForm.addEventListener("submit", this._onRegister);
      this._addProductForm = document.querySelector("#addProductForm");
      this._addProductForm.addEventListener("submit", this._onAddProduct);
      this._getProducts();
    }
  
    async _onLogin(event) {
      event.preventDefault();
      const username = this._loginForm.querySelector("input[name='username']").value;
      const password = this._loginForm.querySelector("input[name='password']").value;
  
      try {
        // Thực hiện xử lý đăng nhập
        const response = await apiRequest("POST", "/login", { username, password });
        alert(response.message);
        window.location.href = "home.html";
      } catch (error) {
        alert("Đăng nhập không thành công. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.");
      }
    }
  
    async _onRegister(event) {
      event.preventDefault();
      const newUsername = this._registerForm.querySelector("input[name='newUsername']").value;
      const newPassword = this._registerForm.querySelector("input[name='newPassword']").value;
  
      try {
        // Gửi yêu cầu đăng ký đến API
        const response = await apiRequest("POST", "/register", { newUsername, newPassword });
        alert(response.message); // Hiển thị thông báo đăng ký thành công
        // Đồng thời có thể chuyển hướng hoặc thực hiện các hành động khác sau khi đăng ký thành công
      } catch (error) {
        alert("Đăng ký không thành công. Vui lòng thử lại.");
      }
    }
  
    async _onAddProduct(event) {
      event.preventDefault();
      const productName = this._addProductForm.querySelector("input[name='productName']").value;
      const productPrice = this._addProductForm.querySelector("input[name='productPrice']").value;
      const productImage = this._addProductForm.querySelector("input[name='productImage']").files[0];
      console.log(productImage);
      try {
        // Gọi hàm addProduct từ class User và chờ kết quả trả về
        const response = await apiRequest("POST", "/products", { productName, productPrice, productImage });
  
        // Xử lý kết quả trả về sau khi thêm sản phẩm thành công
        alert(response.message);
        // Tiếp tục cập nhật danh sách sản phẩm hoặc thực hiện các hành động khác
      } catch (error) {
        // Xử lý lỗi nếu có
        alert("Thêm sản phẩm không thành công. Vui lòng thử lại.");
      }
    }
  
    async _getProducts() {
      try {
        // Gửi yêu cầu API để lấy danh sách sản phẩm
        const response = await apiRequest("GET", "/products");
        // Xử lý danh sách sản phẩm sau khi nhận được phản hồi từ API
        this._displayProducts(response);
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Lỗi khi lấy danh sách sản phẩm:", error.message);
      }
    }
  
    _displayProducts(products) {
      // Lấy danh sách sản phẩm từ phản hồi API
      const productList = document.getElementById("productList");
  
      // Xóa bỏ tất cả các sản phẩm cũ trước khi thêm mới
      productList.innerHTML = "";
  
      // Trong phần hiển thị danh sách sản phẩm
products.forEach(product => {
  // Tạo phần tử div để chứa thông tin sản phẩm
  const productItem = document.createElement("div");
  productItem.classList.add("product-item");

  // Tạo phần tử h3 để hiển thị tên sản phẩm
  const productName = document.createElement("h3");
  productName.textContent = product.productName;

  // Tạo phần tử p để hiển thị giá sản phẩm
  const productPrice = document.createElement("p");
  productPrice.textContent = `Giá: ${product.productPrice}`;

  // Tạo phần tử img để hiển thị hình ảnh sản phẩm
  const productImage = document.createElement("img");
  productImage.src = product.productImage;

  // Tạo nút sửa sản phẩm
  const editButton = document.createElement("button");
  editButton.textContent = "Sửa";
  editButton.classList.add("edit-product-button");
  editButton.dataset.productId = product._id; // Lưu productId vào thuộc tính dataset

  // Tạo nút xóa sản phẩm
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Xóa";
  deleteButton.classList.add("delete-product-button");
  deleteButton.dataset.productId = product._id; // Lưu productId vào thuộc tính dataset

  // Thêm sự kiện click cho nút sửa sản phẩm
  editButton.addEventListener("click", () => {
      app._onEditProduct(product._id);
  });

  // Thêm sự kiện click cho nút xóa sản phẩm
  deleteButton.addEventListener("click", () => {
      app._onDeleteProduct(product._id);
  });

  // Thêm các phần tử con vào phần tử sản phẩm
  productItem.appendChild(productName);
  productItem.appendChild(productPrice);
  productItem.appendChild(productImage);
  productItem.appendChild(editButton);
  productItem.appendChild(deleteButton);

  // Thêm sản phẩm vào danh sách
  productList.appendChild(productItem);
});
    }
    async _onEditProduct(productId) {
      try {
         // Gọi API để lấy thông tin sản phẩm cần sửa
    console.log("Fetching product data for editing...");
    const productToUpdate = await apiRequest("GET", `/products/${productId}`);
    console.log("Product data fetched successfully:", productToUpdate);
    
    // Hiển thị form sửa sản phẩm và điền thông tin sản phẩm cần sửa vào form
    console.log("Prompting user to enter new product information...");
    const productName = prompt("Nhập tên sản phẩm mới:", productToUpdate.productName);
    const productPrice = prompt("Nhập giá sản phẩm mới:", productToUpdate.productPrice);
    console.log("User entered new product information:", productName, productPrice);

    // Tạo object chứa thông tin sản phẩm đã sửa
    const updatedProductData = {
      productName: productName || productToUpdate.productName,
      productPrice: productPrice || productToUpdate.productPrice,
      // Thêm các trường thông tin sản phẩm khác tương tự nếu cần
    };
    console.log("Updated product data:", updatedProductData);
    
    // Gọi API để cập nhật thông tin sản phẩm
    console.log("Updating product...");
    const response = await apiRequest("PUT", `/products/${productId}`, updatedProductData);
    console.log("Product updated successfully:", response);
        // Hiển thị thông báo cập nhật thành công và cập nhật lại danh sách sản phẩm
        alert(response.message);
        this._getProducts();
      } catch (error) {
        // Xử lý lỗi
        console.error("Lỗi khi sửa sản phẩm:", error.message);
        alert("Đã xảy ra lỗi khi sửa sản phẩm. Vui lòng thử lại.");
      }
    }
    
    async _onDeleteProduct(productId) {
      try {
        // Hiển thị cảnh báo xác nhận xóa sản phẩm
        const confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if (confirmDelete) {
          // Gọi API để xóa sản phẩm
          const response = await apiRequest("DELETE", `/products/${productId}`);
          // Hiển thị thông báo xóa thành công và cập nhật lại danh sách sản phẩm
          alert(response.message);
          this._getProducts();
        }
      } catch (error) {
        // Xử lý lỗi
        console.error("Lỗi khi xóa sản phẩm:", error.message);
        alert("Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại.");
      }
    }
    
  }
  
  const app = new App();
  