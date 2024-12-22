import express, {Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

// Environment variables (e.g., PORT, JWT_SECRET, DATABASE_URL)
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:fede311299@localhost:5432/vautest';

// Initialize PostgreSQL client
const pool = new Pool({ connectionString: DATABASE_URL });

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Middleware to authenticate using JWT from cookies
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Access Token Required' });
  }

  jwt.verify(token, JWT_SECRET, (err: unknown, user: unknown) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });
    }

    // @ts-expect-error
    req.user = user;
    next();
  });
};

// Route: Register User
// @ts-expect-error
app.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: (error as {[key:string]: string}).message });
  }
});

// Route: Login User
// @ts-expect-error
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: (error as {[key:string]: string}).message });
  }
});

// Route: List Users (Protected)
//@ts-expect-error
app.get('/users', authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: (error as {[key:string]: string}).message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
