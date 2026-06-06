import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    phone?: string;
    [key: string]: any;
  };
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Create a single supabase client instance
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  if (!supabase) {
    console.error("❌ Critical: SUPABASE_URL or SUPABASE_ANON_KEY is not configured in .env");
    return res.status(500).json({ error: "Internal Server Error: Auth configuration missing" });
  }

  try {
    // Verify the JWT via Supabase API (this correctly handles HS256/RS256 and expiry)
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("🔒 Token validation failed:", error?.message || "User not found");
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }

    // Attach decoded user claims to req.user
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
      ...user.user_metadata,
    };

    next();
  } catch (error: any) {
    console.error("🔒 Token validation failed (exception):", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};
