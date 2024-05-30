import express from "express";
import upload from "../config/utils.js";
import { addMultipleBooks, allBooks, deleteBook, login, myBooks, newBook, register } from "../controllers/sellers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.get('/books', allBooks);
router.post('/addBook', verifyToken, newBook);
router.post('/addBooks', verifyToken, upload.single('file'), addMultipleBooks);
router.get('/myBooks', verifyToken, myBooks);
router.post('/deleteBook', verifyToken, deleteBook);

export default router