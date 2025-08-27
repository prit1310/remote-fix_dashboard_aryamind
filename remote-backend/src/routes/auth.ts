const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Signup
router.post("/signup", async (req: any, res: any) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ error: "Email already in use." });

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, phone, password: hashed },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ error: "Server error." });
    }
});

// Login
router.post("/login", async (req: any, res: any) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email and password required." });

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "Invalid credentials." });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: "Invalid credentials." });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ error: "Server error." });
    }
});

router.get("/me", async (req: any, res: any) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No token." });

    try {
        const token = auth.split(" ")[1];
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) return res.status(404).json({ error: "User not found." });
        res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone ,role: user.role} });
    } catch {
        res.status(401).json({ error: "Invalid token." });
    }
});

router.patch("/profile", async (req: any, res: any) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No token." });

    try {
        const token = auth.split(" ")[1];
        const payload = jwt.verify(token, JWT_SECRET);
        const { name, email, phone } = req.body;

        // Optionally: validate fields here

        const user = await prisma.user.update({
            where: { id: payload.userId },
            data: { name, email, phone },
        });

        res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        res.status(401).json({ error: "Invalid token or update failed." });
    }
});

module.exports = router;