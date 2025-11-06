import { Router } from 'express';
import { prisma } from '../index.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'; 

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

// === Rota de Registro ===
// Rota: POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400) // Bad Request
        .json({ error: 'Email e senha são obrigatórios.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Este email já está em uso.' }); // Conflict
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    res.status(201).json({ // 201 = Created
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno ao tentar registrar.' });
  }
});

// === Rota de Login ===
// Rota: POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); // Unauthorized
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); // Unauthorized
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, // O "payload" (dados) do token
      JWT_SECRET, // O segredo que lemos do .env
      { expiresIn: '7d' } // Token expira em 7 dias
    );

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao tentar logar.' });
  }
});

export default router;