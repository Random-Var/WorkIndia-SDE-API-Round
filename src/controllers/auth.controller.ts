import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
    const { name, password, role } = req.body;

    if (!name || !password || !role){
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    if (!["ADMIN", "NORMAL_USER"].includes(role)){
        res.status(400).json({ error: "Invalid role" });
        return;
    }
    const existingUser = await prisma.user.findUnique({ where: { name } });
    if (existingUser){
        res.status(401).json({ error: `User named ${name} already exists` });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await prisma.user.create({
            data: { name, password: hashedPassword, role },
        });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "User creation failed" });
    }
}

export const login = async (req: Request, res: Response) => {
    const { name, password } = req.body;

    if (!name || !password){
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    const user = await prisma.user.findUnique({ where: { name } });
    if (!user){
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ message: "Logged in successfully" });
}
