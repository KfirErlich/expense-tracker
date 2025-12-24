import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth'; // ייבוא ישיר של פונקציית ה-Auth

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // שליפת הטוקן מה-Header
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // שימוש ב-getAuth() במקום ב-admin.auth()
        const decodedToken = await getAuth().verifyIdToken(token);
        
        // הצמדת המשתמש המאומת לאובייקט הבקשה
        (req as any).user = decodedToken;
        
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};