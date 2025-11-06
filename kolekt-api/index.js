import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import apiRoutes from './routes/api.routes.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();
const port = process.env.PORT || 3001;
export const prisma = new PrismaClient(); 

// === Middlewares ===
app.use(express.json());
app.use(cors());

// Rotas
app.use('/auth', authRoutes);
app.use('/api', authMiddleware, apiRoutes);

// === Rota de Teste ===
app.get('/', (req, res) => {
    res.send('API do Kolekt está no ar!');
});

// === Inicia o Servidor ===
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});