import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export const login = async (req: Request, res: Response) => {
  // TODO: If the user exists and the password is correct, return a JWT token
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({
      where: { username: { [Op.iLike]: username }}
    });
    // console.log(user)

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password with the hashed password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // console.log(password)

    // Generate a JWT token
    const token = jwt.sign(
      { username: user.username }, 
      process.env.JWT_SECRET_KEY as string, 
      { expiresIn: '1h' }
    );
    // console.log(token)

    // Return the token
    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;