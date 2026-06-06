import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthenticatedRequest } from "./authMiddleware";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Health Check Route (Public)
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "Slay Health API Server" });
});

// GET currently logged-in user's token details (Protected)
app.get("/api/auth/me", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const phone = req.user?.phone || req.user?.sub;
    if (!phone) return res.status(400).json({ error: "No phone in token" });

    const user = await prisma.user.findUnique({
      where: { phone },
      include: { lifestyle: true }
    });

    res.json({
      message: "Authenticated successfully",
      tokenUser: req.user,
      dbUser: user
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
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

// POST create/update user profile (Protected)
app.post("/api/users", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, dob, age, gender, city, relationshipStatus, marriageTimeline, userRelation, lifestyle } = req.body;
  const phone = req.user?.phone || req.user?.sub;
  if (!phone) return res.status(400).json({ error: "Phone number missing in token" });

  try {
    const userData = {
      name, email: email || null, dob: dob ? new Date(dob) : null, age: age ? parseInt(age) : null,
      gender, city, relationshipStatus, marriageTimeline, userRelation
    };

    const user = await prisma.user.upsert({
      where: { phone },
      update: userData,
      create: { phone, ...userData }
    });

    if (lifestyle) {
      const lsData = {
        activityLevel: lifestyle.activityLevel || '',
        dailySteps: parseInt(lifestyle.dailySteps || 0),
        occupation: lifestyle.occupation || '',
        workStyle: lifestyle.workStyle || '',
        drinkingHabit: lifestyle.drinkingHabit || '',
        smokingHabit: lifestyle.smokingHabit || '',
        tobaccoHabit: lifestyle.tobaccoHabit || '',
        sleepPattern: lifestyle.sleepPattern || '',
        heightValue: parseFloat(lifestyle.height?.value || 0),
        heightUnit: lifestyle.height?.unit || "cm",
        weightValue: parseFloat(lifestyle.weight?.value || 0),
        weightUnit: lifestyle.weight?.unit || "kg",
        waistValue: parseFloat(lifestyle.waistCircumference?.value || 0),
        waistUnit: lifestyle.waistCircumference?.unit || "in",
        menstrualCycle: lifestyle.menstrualCycle || null,
      };

      await prisma.lifestyle.upsert({
        where: { userId: user.id },
        update: lsData,
        create: { ...lsData, userId: user.id }
      });
    }

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id }, include: { lifestyle: true } });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to upsert user", details: error });
  }
});

// GET all matches for the current user (Protected)
app.get("/api/matches", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const phone = req.user?.phone || req.user?.sub;
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.json([]);
    
    const matches = await prisma.match.findMany({
      where: { userId: user.id },
      include: {
        user: { include: { lifestyle: true } },
        prospect: { include: { lifestyle: true } },
        reports: true,
        analysisResults: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matches", details: error });
  }
});

// GET a specific match (Protected)
app.get("/api/matches/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id },
      include: {
        user: { include: { lifestyle: true } },
        prospect: { include: { lifestyle: true } },
        reports: true,
        analysisResults: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });
    if (!match) return res.status(404).json({ error: "Match not found" });
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch match" });
  }
});

// POST create a match and prospect (Protected)
app.post("/api/matches", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { name, dob, age, gender, city, meetingSource, platformName, lifestyle } = req.body;
  const phone = req.user?.phone || req.user?.sub;
  
  try {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const prospect = await prisma.prospect.create({
      data: {
        name, dob: dob ? new Date(dob) : null, age: age ? parseInt(age) : null,
        gender, city, meetingSource, platformName,
        lifestyle: lifestyle ? {
          create: {
            activityLevel: lifestyle.activityLevel || '',
            dailySteps: parseInt(lifestyle.dailySteps || 0),
            occupation: lifestyle.occupation || '',
            workStyle: lifestyle.workStyle || '',
            drinkingHabit: lifestyle.drinkingHabit || '',
            smokingHabit: lifestyle.smokingHabit || '',
            tobaccoHabit: lifestyle.tobaccoHabit || '',
            sleepPattern: lifestyle.sleepPattern || '',
            heightValue: parseFloat(lifestyle.height?.value || 0),
            heightUnit: lifestyle.height?.unit || "cm",
            weightValue: parseFloat(lifestyle.weight?.value || 0),
            weightUnit: lifestyle.weight?.unit || "kg",
            waistValue: parseFloat(lifestyle.waistCircumference?.value || 0),
            waistUnit: lifestyle.waistCircumference?.unit || "in",
            menstrualCycle: lifestyle.menstrualCycle || null,
          }
        } : undefined
      }
    });

    const match = await prisma.match.create({
      data: {
        userId: user.id,
        prospectId: prospect.id,
        status: "pending"
      },
      include: { prospect: { include: { lifestyle: true } } }
    });
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ error: "Failed to create match", details: error });
  }
});

// POST analyze lab reports for a match (Protected)
app.post("/api/matches/:id/analyze", authMiddleware, upload.fields([{ name: 'female_pdf', maxCount: 1 }, { name: 'male_pdf', maxCount: 1 }]), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const matchId = req.params.id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files?.female_pdf?.[0] || !files?.male_pdf?.[0]) {
      return res.status(400).json({ error: "Both female_pdf and male_pdf are required." });
    }

    await prisma.match.update({ where: { id: matchId }, data: { status: "analyzing" } });

    const form = new FormData();
    form.append("female_pdf", files.female_pdf[0].buffer, {
      filename: files.female_pdf[0].originalname,
      contentType: files.female_pdf[0].mimetype,
    });
    form.append("male_pdf", files.male_pdf[0].buffer, {
      filename: files.male_pdf[0].originalname,
      contentType: files.male_pdf[0].mimetype,
    });

    for (const key in req.body) {
      form.append(key, req.body[key]);
    }

    const response = await axios.post("http://localhost:8000/analyze_and_interpret", form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 120000 
    });

    const resultData = response.data;
    const combinedScore = resultData.combined_result?.final_score 
      ? Math.round(resultData.combined_result.final_score) 
      : null;

    const analysisRecord = await prisma.analysisResult.create({
      data: {
        matchId: matchId,
        resultData: resultData
      }
    });

    await prisma.match.update({
      where: { id: matchId },
      data: { 
        status: "completed",
        score: combinedScore
      }
    });

    res.status(200).json({ analysisRecord, data: resultData });
  } catch (error: any) {
    console.error("Analysis proxy error:", error.message);
    await prisma.match.update({ where: { id: req.params.id }, data: { status: "error" } });
    res.status(500).json({ error: "Analysis failed", details: error?.response?.data || error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Slay Health Server is running on http://localhost:${port}`);
});
