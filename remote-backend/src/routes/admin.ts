const express = require("express");
const prisma = require("../prisma");
const adminMiddleware = require("../middleware/adminAuth");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Get all tickets
router.get("/tickets", adminMiddleware, async (req: any, res: any) => {
  const tickets = await prisma.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ tickets });
});

// Update ticket status
router.patch("/tickets/:id", adminMiddleware, async (req: any, res: any) => {
  const { status } = req.body;
  const { id } = req.params;
  if (!["pending", "in-progress", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const ticket = await prisma.ticket.update({
    where: { id: Number(id) },
    data: { status }
  });
  res.json({ ticket });
});

// Get all users
router.get("/users", adminMiddleware, async (req: any, res: any) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
  });
  res.json({ users });
});

// Create a new user (admin or normal)
router.post("/users", adminMiddleware, async (req: any, res: any) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return res.status(400).json({ error: "All fields required" });
  }
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'user' or 'admin'" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, phone, password: hashed, role }
  });
  res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
});

// Add a new service (admin only)
router.post("/services", adminMiddleware, async (req:any, res:any) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const service = await prisma.service.create({ data: { name } });
  res.json({ service });
});

// Get all services (public)
router.get("/services", async (req:any, res:any) => {
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });
  res.json({ services });
});

module.exports = router;