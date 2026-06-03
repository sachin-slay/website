import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    scope?: string;
    [key: string]: any;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    console.error("❌ Critical: SUPABASE_JWT_SECRET is not configured in .env");
    return res.status(500).json({ error: "Internal Server Error: Auth configuration missing" });
  }

  try {
    // Verify the JWT signature using the Supabase JWT secret.
    // Supabase tokens are HS256-signed with the JWT secret.
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Attach decoded claims to req.user
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      scope: decoded.scope, // Custom OAuth scope if issued via OAuth flow
      ...decoded,
    };

    next();
  } catch (error: any) {
    console.error("🔒 Token validation failed:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};
