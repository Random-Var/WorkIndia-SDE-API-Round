import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET!

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"];

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const userId = decoded.userId;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user || !roles.includes(user.role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      req.body.userId = userId;

      next();
    }
    catch (error) {
      res.status(403).json({ error: "Invalid token" });
    }
  };
};
