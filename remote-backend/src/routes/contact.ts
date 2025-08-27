const express = require("express");
const prisma = require("../prisma");
const router = express.Router();

// POST /api/contact
router.post("/add", async (req:any, res:any) => {
  const { name, email, phone, computerType, description, urgency, userId } = req.body;
  if (!name || !email || !phone || !computerType || !description || !urgency) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const contact = await prisma.contactRequest.create({
    data: { name, email, phone, computerType, description, urgency, userId: userId || null }
  });
  res.json({ success: true, contact });
});

module.exports = router;