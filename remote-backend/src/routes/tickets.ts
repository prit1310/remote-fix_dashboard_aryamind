const express = require("express");
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware to get user from token
function authMiddleware(req:any, res:any, next:any) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token." });
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
}

// Get all tickets for logged-in user
router.get("/", authMiddleware, async (req:any, res:any) => {
  const tickets = await prisma.ticket.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
    include: {
      engineer: { select: { id: true, name: true, email: true, phone: true } }
    }
  });
  res.json({ tickets });
});

// Create a new ticket
router.post("/", authMiddleware, async (req:any, res:any) => {
  const {  description, service } = req.body;
  if ( !description || !service) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const ticket = await prisma.ticket.create({
    data: {
      description,
      service,
      userId: req.userId,
      status: "pending"
    }
  });
  res.json({ ticket });
});

// (Optional) Update ticket status
router.patch("/:id", authMiddleware, async (req:any, res:any) => {
  const { status } = req.body;
  const { id } = req.params;
  const ticket = await prisma.ticket.update({
    where: { id: Number(id), userId: req.userId },
    data: { status }
  });
  res.json({ ticket });
});

// (Optional) Delete a ticket
router.delete("/:id", authMiddleware, async (req:any, res:any) => {
  const { id } = req.params;
  await prisma.ticket.delete({
    where: { id: Number(id), userId: req.userId }
  });
  res.json({ success: true });
});

module.exports = router;