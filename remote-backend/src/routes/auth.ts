const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const axios = require("axios");
const querystring = require("querystring");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

function requireAuth(req: any, res: any, next: any) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No token." });

    try {
        const token = auth.split(" ")[1];
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = { id: payload.userId };
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token." });
    }
}

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
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone || "", role: user.role } });
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
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone || "", role: user.role } });
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
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || "", // always a string
                role: user.role
            }
        });
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

        res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone || "", role: user.role } });
    } catch (err) {
        res.status(401).json({ error: "Invalid token or update failed." });
    }
});

router.get("/user/inprogress-payments", requireAuth, async (req: any, res: any) => {
    const userId = req.user.id;
    const payments = await prisma.inProgressPayment.findMany({
        where: { userId },
    });
    res.json({ payments });
});

router.get("/engineer/assigned-tickets", requireAuth, async (req: any, res: any) => {
    const engineerId = req.user.id;
    const tickets = await prisma.ticket.findMany({
        where: { engineerId },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } }
        },
        orderBy: { createdAt: "desc" }
    });
    res.json({ tickets });
});

// Google OAuth login - Step 1: Redirect to Google consent screen
router.get("/google/login", (req:any, res:any) => {
    const params = querystring.stringify({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Google OAuth callback - Step 2: Exchange code for tokens and login/create user
router.get("/google/callback", async (req:any, res:any) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("No code provided");
  
    try {
      // Exchange code for tokens
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        querystring.stringify({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
  
      const { access_token } = tokenResponse.data;
  
      // Get user info
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
  
      const { email, name } = userInfoResponse.data;
  
      if (!email) return res.status(400).send("Google account has no email");
  
      // Find or create user
      let user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: name || "No Name",
            email,
            phone: "", // optional field, empty string or null
            password: null, // no password for social login
            role: "user",
          },
        });
      }
  
      // Issue JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  
      // Redirect to frontend with token in query string
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Authentication failed");
    }
  });


module.exports = router;