import apiRequest from "./apirequest.js";

export default class User {
  static async login(username, password) {
    try {
      // Gửi yêu cầu đăng nhập đến API
      const response = await apiRequest("POST", "/login", { username, password });
      // Nếu đăng nhập thành công, trả về dữ liệu phản hồi
      return response;
    } catch (error) {
      // Xử lý lỗi nếu đăng nhập không thành công
      throw new Error("Đăng nhập không thành công. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.");
    }
  }

  static async register(newUsername, newPassword) {
    try {
      // Gửi yêu cầu đăng ký đến API
      const response = await apiRequest("POST", "/register", { newUsername, newPassword });
      // Nếu đăng ký thành công, trả về dữ liệu phản hồi
      return response;
    } catch (error) {
      // Xử lý lỗi nếu đăng ký không thành công
      throw new Error("Đăng ký không thành công. Vui lòng thử lại.");
    }
  }
  static async addProduct(productName, productPrice, productImage) {
    try {
      

      // Gửi yêu cầu API để thêm sản phẩm mới
      const response = await apiRequest("POST", "/products", {productName, productPrice, productImage});
      return response;
    } catch (error) {
      throw new Error("Thêm sản phẩm không thành công. Vui lòng thử lại.");
    }
  }
  static async getProducts() {
    try {
      // Gửi yêu cầu API để lấy danh sách sản phẩm
      const response = await apiRequest("GET", "/products");
      // Trả về danh sách sản phẩm sau khi nhận được phản hồi từ API
      return response;
    } catch (error) {
      // Xử lý lỗi nếu có
      throw new Error("Lỗi khi lấy danh sách sản phẩm");
    }
  }
  static async editProduct(productId, updatedProduct) {
    try {
        // Gửi yêu cầu API để sửa sản phẩm
        const response = await apiRequest("PUT", `/products/${productId}`, updatedProduct);
        return response;
    } catch (error) {
        throw new Error("Sửa sản phẩm không thành công. Vui lòng thử lại.");
    }
}

static async deleteProduct(productId) {
    try {
        // Gửi yêu cầu API để xóa sản phẩm
        const response = await apiRequest("DELETE", `/products/${productId}`);
        return response;
    } catch (error) {
        throw new Error("Xóa sản phẩm không thành công. Vui lòng thử lại.");
    }
}
}
