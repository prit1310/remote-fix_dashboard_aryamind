const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

async function adminMiddleware(req:any, res:any, next:any) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token." });
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return res.status(403).json({ error: "Admin only" });
    }
    req.userId = user.id;
    req.userRole = user.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
}

module.exports = adminMiddleware;