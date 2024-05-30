import { db } from "../config/db.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from 'uuid'

export const register = (req, res) => {

    const q = "SELECT * FROM users WHERE email = ?"

    db.query(q, [req.body.email], (err, data) => {

        if (err) return res.status(500).json(err);
        if (data.length) return res.status(400).json("User already Exists");

        const { email, password, name, username } = req.body;

        if (!password || !username || !name)
            return res.status(401).json("Please provide all fields !")

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const q = "INSERT INTO users (`id`,`username`,`email`,`password`,`name`) VALUE (?)"

        const values = [
            uuid(),
            username,
            email,
            hashedPassword,
            name,
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json({
                success: true,
                message: 'User Signed up'
            });
        })
    })
}

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE email = ?";

    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found!");

        if (!req.body.password) return res.status(401).json("Please enter the password")

        const checkPassword = bcrypt.compareSync(
            req.body.password,
            data[0].password
        );

        if (!checkPassword)
            return res.status(400).json("Wrong password or username!");

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

