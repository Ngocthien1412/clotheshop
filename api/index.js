import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import multer from "multer";


const DATABASE_NAME = "clotheshop";

const api = new express.Router();
const upload = multer();
let productCollection;
let userCollection;

const initApi = async (app) => {
    app.set("json spaces", 2);
    app.use("/api", api);

    const conn = await MongoClient.connect(`mongodb://0.0.0.0:27017`);
    const db = conn.db(DATABASE_NAME);
    productCollection = db.collection("products");
    userCollection = db.collection("users");
    
};

api.use(bodyParser.json());

// Đăng nhập
api.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu bằng username
    const user = await userCollection.findOne({ username });

    // Nếu không tìm thấy người dùng, trả về lỗi
    if (!user) {
        return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    // So sánh mật khẩu được băm với mật khẩu người dùng nhập vào
    const match = await bcrypt.compare(password, user.password);

    // Nếu mật khẩu không khớp, trả về lỗi
    if (!match) {
        return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    // Nếu mọi thứ hợp lệ, trả về thông báo đăng nhập thành công
    res.status(200).json({ message: "Đăng nhập thành công" });
});

// Đăng ký
api.post("/register", async (req, res) => {
    const { newUsername, newPassword } = req.body;
    // Kiểm tra xem tài khoản đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await userCollection.findOne({ username: newUsername });
    if (existingUser) {
        return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    // Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const newUser = {
        username: newUsername,
        password: hashedPassword
    };

    // Thêm tài khoản mới vào cơ sở dữ liệu
    await userCollection.insertOne(newUser);

    res.status(201).json({ message: "Đăng ký thành công" });
});


// Thêm sản phẩm
api.post("/products", async (req, res) => {
    const { productName, productPrice, productImage } = req.body;
    const newproduct = {
        productName: productName,
        productPrice: productPrice,
        productImage: productImage
    };
    await productCollection.insertOne(newproduct);
    res.status(201).json({ message: "Sản phẩm đã được thêm thành công" });
});



// Lấy danh sách sản phẩm
api.get("/products", async (req, res) => {
    const products = await productCollection.find({}, { projection: { productName: 1, productPrice: 1, productImage: 1 } }).toArray();
    res.status(200).json(products);
});
api.get("/products/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await productCollection.findOne({ _id: new ObjectId(productId) });
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thông tin sản phẩm" });
    }
});

// Sửa sản phẩm
api.put("/products/:id", async (req, res) => {
    let id  = req.params.id;
    const updatedProduct = req.body;
    await productCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedProduct });
    res.status(200).json({ message: "Sản phẩm đã được cập nhật thành công" });
});

// Xóa sản phẩm
api.delete("/products/:id", async (req, res) => {
    let id  = req.params.id;
    await productCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
});

export default initApi;
