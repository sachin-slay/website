import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthenticatedRequest } from "./authMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health Check Route (Public)
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "Slay Health API Server" });
});

// GET currently logged-in user's token details (Protected)
app.get("/api/auth/me", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: "Authenticated successfully",
    user: req.user
  });
});

// GET all users (Protected)
app.get("/api/users", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { lifestyle: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users", details: error });
  }
});

// POST create user profile (Protected)
app.post("/api/users", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, dob, age, gender, city, relationshipStatus, marriageTimeline, userRelation, lifestyle } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        dob: dob ? new Date(dob) : null,
        age: age ? parseInt(age) : null,
        gender,
        city,
        relationshipStatus,
        marriageTimeline,
        userRelation,
        lifestyle: lifestyle ? {
          create: {
            activityLevel: lifestyle.activityLevel,
            dailySteps: parseInt(lifestyle.dailySteps || 0),
            occupation: lifestyle.occupation,
            workStyle: lifestyle.workStyle,
            drinkingHabit: lifestyle.drinkingHabit,
            smokingHabit: lifestyle.smokingHabit,
            tobaccoHabit: lifestyle.tobaccoHabit,
            sleepPattern: lifestyle.sleepPattern,
            heightValue: parseFloat(lifestyle.height?.value || 0),
            heightUnit: lifestyle.height?.unit || "cm",
            weightValue: parseFloat(lifestyle.weight?.value || 0),
            weightUnit: lifestyle.weight?.unit || "kg",
            waistValue: parseFloat(lifestyle.waistCircumference?.value || 0),
            waistUnit: lifestyle.waistCircumference?.unit || "in",
            menstrualCycle: lifestyle.menstrualCycle,
          }
        } : undefined
      },
      include: { lifestyle: true }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user", details: error });
  }
});

// GET all matches (Protected)
app.get("/api/matches", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const matches = await prisma.match.findMany({
      include: {
        user: { include: { lifestyle: true } },
        prospect: { include: { lifestyle: true } },
        reports: true
      }
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matches", details: error });
  }
});

app.listen(port, () => {
  console.log(`🚀 Slay Health Server is running on http://localhost:${port}`);
});
