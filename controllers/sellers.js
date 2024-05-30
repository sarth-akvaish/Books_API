import bcrypt from "bcrypt";
import csv from 'csv-parser';
import fs from 'fs';
import jwt from "jsonwebtoken";
import { v4 as uuid } from 'uuid';
import { db } from "../config/db.js";

export const register = (req, res) => {

    const q = "SELECT * FROM sellers WHERE email = ?"

    db.query(q, [req.body.email], (err, data) => {

        if (err) return res.status(500).json(err);
        if (data.length) return res.status(400).json("User already Exists");

        const { name, username, password } = req.body;

        if (!username || !name || !password)
            return res.status(401).json('Provide all fields')

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO sellers (`id`,`username`,`email`,`password`,`name`) VALUE (?)"

        const values = [
            uuid(),
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name,
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json('Seller entry has been created');
        })
    })
}

export const login = (req, res) => {
    const q = "SELECT * FROM sellers WHERE email = ?";

    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found!");

        // console.log(data)
        if (!req.body.password) return res.status(401).json('Fill the password field !')

        const checkPassword = bcrypt.compareSync(
            req.body.password,
            data[0].password
        );

        if (!checkPassword)
            return res.status(400).json("Wrong password !");

        const token = jwt.sign({ id: data[0].id }, "secretkey", { expiresIn: "1d" });

        const { password, ...others } = data[0];

        res
            .cookie("accessToken", token, {
                httpOnly: true,
            })
            .status(200)
            .json({ token, ...others });
    });
}

export const allBooks = (req, res) => {
    const q = "SELECT * FROM books ";

    db.query(q, [], (err, data) => {
        if (err) return res.status(500).json(err);

        res.status(203).json(data);
    })
}

export const newBook = (req, res) => {
    const q = "SELECT * FROM books WHERE title = ? AND author = ?";

    db.query(q, [req.body.title, req.body.author], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(400).json("Book already Exists");

        const { title, author, publishedDate, price } = req.body;

        if (!title || !author || !publishedDate || !price)
            return res.status(401).json({
                success: false,
                message: 'Please Provide all fields Data!'
            })

        const q = "INSERT INTO books (`title`,`author`,`publishedDate`,`price`,`seller_id`) VALUE (?)";

        const values = [
            title,
            author,
            publishedDate,
            price,
            req.user.id
        ]
        console.log(values)

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json({
                success: true,
                message: 'Book entry has been done'
            });
        })

    })
}

export const addMultipleBooks = (req, res) => {

    const data = [];

    const stream = fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => data.push(row))
        .on('end', () => {
            insertDataToMySQL(data, req.user.id);
        })
        .on('finish', () => res.json({
            success: true,
            message: 'Books added successfully'
        }))
        .on('error', (err) => console.error(err));

}

function insertDataToMySQL(csvData, id) {

    const query = "INSERT INTO books (`title`,`author`,`publishedDate`,`price`,`seller_id`) VALUE (?)";
    csvData.forEach(data => {
        data.seller_id = id;
        const values = [
            data.title,
            data.author,
            data.publishedDate,
            data.price,
            data.seller_id
        ]
        db.query(query, [values], (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Successfully inserted rows!`);
            }
        });
    });
}

export const myBooks = (req, res) => {
    const q = "SELECT * FROM books WHERE seller_id = ?"
    db.query(q, [req.user.id], (err, data) => {
        if (err) return res.status(500).json(err);

        res.status(203).json(data);
    })
}

export const deleteBook = (req, res) => {
    // provide the id to delete the book
    const id = req.query.id;

    if (!id) return res.status(404).json({ message: 'Provide the id to delete the book' })

    const q = "SELECT * FROM books WHERE id = ? AND seller_id = ?";

    db.query(q, [id, req.user.id], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) return res.status(404).json({ error: "You are not allowed to delete this book" })

        const q = "DELETE FROM books WHERE id = ? AND seller_id = ?";
        db.query(q, [id, req.user.id], (err, data) => {

            res.status(203).json({
                success: true,
                message: "Book deleted successfully"
            });
        })

    })
}