import { Router } from 'express';
import { prisma } from '../index.js';
import axios from 'axios';
import { load } from 'cheerio'; 

const router = Router();

router.get('/hello', (req, res) => {
    res.json({ message: `Olá, ${req.user.email}! Sua rota protegida funciona!` });
});

// ===================================================================
// ===                ROTAS DE COLEÇÕES (Collections)              ===
// ===================================================================

// POST /api/collections (Criar nova coleção)
router.post('/collections', async (req, res) => {
    const { title } = req.body;
    const userId = req.user.userId; 

    if (!title) {
        return res.status(400).json({ error: 'O título é obrigatório.' });
    }

    try {
        const newCollection = await prisma.collection.create({
            data: {
                title: title,
                userId: userId, 
            },
        });
        res.status(201).json(newCollection);
    } catch (error) {
        console.error('Erro ao criar coleção:', error);
        res.status(500).json({ error: 'Erro interno ao criar coleção.' });
    }
});

// GET /api/collections (Listar todas as coleções do usuário)
router.get('/collections', async (req, res) => {
    const userId = req.user.userId; 

    try {
        const collections = await prisma.collection.findMany({
            where: {
                userId: userId, 
            },
            orderBy: {
                createdAt: 'desc', 
            },
            include: {
                links: {
                    orderBy: {
                        createdAt: 'desc', 
                    },
                },
            },
        });

        res.status(200).json(collections);
    } catch (error) {
        console.error('Erro ao listar coleções:', error);
        res.status(500).json({ error: 'Erro interno ao listar coleções.' });
    }
});

// ===================================================================
// ===                   ROTAS DE LINKS (Links)                    ===
// ===================================================================

// POST /api/links (CRIAR UM NOVO LINK)
router.post('/links', async (req, res) => {
    try {
        const { url, collectionId } = req.body;
        const userId = req.user.userId; 

        if (!url || !collectionId) {
            return res
                .status(400)
                .json({ error: 'URL e collectionId são obrigatórios.' });
        }

        const numericCollectionId = parseInt(collectionId, 10);

        const collection = await prisma.collection.findFirst({
            where: {
                id: numericCollectionId,
                userId: userId, 
            },
        });

        if (!collection) {
            return res
                .status(404)
                .json({ error: 'Coleção não encontrada ou não pertence a você.' });
        }

        let title = 'Título não encontrado';
        let description = 'Descrição não disponível.';
        let imageUrl = null;

        try {
            const { data: html } = await axios.get(url, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });

            const $ = load(html); 

            title =
                $('meta[property="og:title"]').attr('content') ||
                $('title').text() ||
                $('meta[name="title"]').attr('content');

            description =
                $('meta[property="og:description"]').attr('content') ||
                $('meta[name="description"]').attr('content');

            imageUrl =
                $('meta[property="og:image"]').attr('content') ||
                $('meta[property="og:image:url"]').attr('content');

            if (title) title = title.trim();
            if (description) description = description.trim();
        } catch (scrapeError) {
            console.warn(`Falha ao fazer scraping de ${url}: ${scrapeError.message}`);
        }

        const newLink = await prisma.link.create({
            data: {
                url: url,
                title: title || 'Link salvo', 
                description: description,
                imageUrl: imageUrl,
                collectionId: numericCollectionId, 
            },
        });

        res.status(201).json(newLink);
    } catch (error) {
        console.error('Erro ao criar link:', error);
        res.status(500).json({ error: 'Erro interno ao salvar o link.' });
    }
});

// ===================================================================
// ===                ROTAS DE DELETE (Exclusão)                   ===
// ===================================================================

// DELETE /api/collections/:id (Excluir uma coleção inteira)
router.delete('/collections/:id', async (req, res) => {
    const collectionId = parseInt(req.params.id, 10);
    const userId = req.user.userId; 

    try {
        const deleteResult = await prisma.collection.deleteMany({
            where: {
                id: collectionId,
                userId: userId,
            },
        });

        if (deleteResult.count === 0) {
            return res.status(404).json({ error: 'Coleção não encontrada ou você não tem permissão.' });
        }

        res.status(204).send();

    } catch (error) {
        console.error('Erro ao excluir coleção:', error);
        res.status(500).json({ error: 'Erro interno ao excluir coleção.' });
    }
});

router.delete('/links/:id', async (req, res) => {
    const linkId = parseInt(req.params.id, 10);
    const userId = req.user.userId; // Vem do token

    try {
        const deleteResult = await prisma.link.deleteMany({
            where: {
                id: linkId,
                collection: {
                    userId: userId,
                },
            },
        });

        if (deleteResult.count === 0) {
            return res.status(404).json({ error: 'Link não encontrado ou você não tem permissão.' });
        }

        res.status(204).send(); // Sucesso

    } catch (error) {
        console.error('Erro ao excluir link:', error);
        res.status(500).json({ error: 'Erro interno ao excluir link.' });
    }
});

export default router;