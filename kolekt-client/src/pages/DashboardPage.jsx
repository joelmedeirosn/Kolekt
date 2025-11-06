import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Link as MuiLink,
    Card,
    CardContent,
    CardMedia,
    Alert,
    IconButton,
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function DashboardPage() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [newCollectionTitle, setNewCollectionTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [selectedCollectionId, setSelectedCollectionId] = useState('');
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // Ex: { type: 'link', id: 5 }

    // --- Função de Lógica Principal ---

    const fetchCollections = async () => {
        try {
            const response = await api.get('/api/collections');
            setCollections(response.data);

            if (response.data.length > 0 && selectedCollectionId === '') {
                setSelectedCollectionId(response.data[0].id);
            }
        } catch (err) {
            console.error('Erro ao buscar coleções:', err);
            setError('Falha ao carregar dados. Tente logar novamente.');
            if (err.response && (err.response.status === 400 || err.response.status === 401)) {
                localStorage.removeItem('kolekt-token');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchCollections().finally(() => setLoading(false));
    }, [navigate]);

    // --- Funções de "Handle" (CRUD) ---

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollectionTitle.trim()) return;
        setIsCreating(true);
        try {
            await api.post('/api/collections', { title: newCollectionTitle });
            setNewCollectionTitle('');
            await fetchCollections();
        } catch (err) {
            console.error('Erro ao criar coleção:', err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreateLink = async (e) => {
        e.preventDefault();
        if (!newLinkUrl.trim() || !selectedCollectionId) return;
        setIsAddingLink(true);
        try {
            await api.post('/api/links', {
                url: newLinkUrl,
                collectionId: parseInt(selectedCollectionId, 10),
            });
            setNewLinkUrl('');
            await fetchCollections();
        } catch (err) {
            console.error('Erro ao criar link:', err);
            alert('Houve um erro ao adicionar seu link. A URL pode estar inválida ou o site pode estar nos bloqueando.');
        } finally {
            setIsAddingLink(false);
        }
    };

    const handleDeleteCollection = async (collectionId) => {
        setDeletingId(`collection-${collectionId}`);
        try {
            await api.delete(`/api/collections/${collectionId}`);
            await fetchCollections();
        } catch (err) {
            console.error('Erro ao excluir coleção:', err);
            alert('Não foi possível excluir a coleção.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteLink = async (linkId) => {
        setDeletingId(`link-${linkId}`);
        try {
            await api.delete(`/api/links/${linkId}`);
            await fetchCollections();
        } catch (err) {
            console.error('Erro ao excluir link:', err);
            alert('Não foi possível excluir o link.');
        } finally {
            setDeletingId(null);
        }
    };

    const openDeleteModal = (type, id) => {
        setItemToDelete({ type, id }); // Guarda quem será excluído
        setIsModalOpen(true); // Abre o modal
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setItemToDelete(null); // Limpa o item
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'collection') {
            await handleDeleteCollection(itemToDelete.id);
        } else if (itemToDelete.type === 'link') {
            await handleDeleteLink(itemToDelete.id);
        }

        closeDeleteModal(); 
    };



    if (loading) {
        return <Container sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Container>;
    }

    if (error) {
        return <Container><Alert severity="error">{error}</Alert></Container>;
    }

    return (
        <Container maxWidth="lg">
            <Typography component="h1" variant="h4" gutterBottom>
                Seu Dashboard
            </Typography>

            <Paper elevation={2} sx={{ padding: 3, mb: 3 }}>
                <Typography component="h2" variant="h6" gutterBottom>
                    Criar Nova Coleção
                </Typography>
                <Box component="form" onSubmit={handleCreateCollection} sx={{ display: 'flex' }}>
                    <TextField
                        label="Ex: Meus Links de Python"
                        variant="outlined"
                        size="small"
                        value={newCollectionTitle}
                        onChange={(e) => setNewCollectionTitle(e.target.value)}
                        disabled={isCreating}
                        sx={{ flexGrow: 1, mr: 2 }}
                    />
                    <Button type="submit" variant="contained" disabled={isCreating} sx={{ minWidth: 100 }}>
                        {isCreating ? <CircularProgress size={24} /> : 'Criar'}
                    </Button>
                </Box>
            </Paper>

            {collections.length > 0 && (
                <Paper elevation={2} sx={{ padding: 3, mb: 3 }}>
                    <Typography component="h2" variant="h6" gutterBottom>
                        Adicionar Novo Link
                    </Typography>
                    <Box component="form" onSubmit={handleCreateLink}>
                        <TextField
                            label="https://exemplo.com"
                            type="url"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={newLinkUrl}
                            onChange={(e) => setNewLinkUrl(e.target.value)}
                            disabled={isAddingLink}
                            required
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControl fullWidth sx={{ mr: 2 }}>
                                <InputLabel id="select-collection-label">Salvar na Coleção</InputLabel>
                                <Select
                                    labelId="select-collection-label"
                                    label="Salvar na Coleção"
                                    value={selectedCollectionId}
                                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                                    disabled={isAddingLink}
                                    size="small"
                                >
                                    {collections.map((collection) => (
                                        <MenuItem key={collection.id} value={collection.id}>
                                            {collection.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button type="submit" variant="contained" disabled={isAddingLink} sx={{ minWidth: 150 }}>
                                {isAddingLink ? <CircularProgress size={24} /> : 'Adicionar Link'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}

            <hr style={{ margin: '24px 0', borderColor: '#333' }} />

            {collections.length === 0 ? (
                <Typography>Você ainda não tem nenhuma coleção. Crie uma acima!</Typography>
            ) : (
                collections.map((collection) => (
                    <Card key={collection.id} elevation={2} sx={{ mb: 3 }}>

                        <Box sx={{
                            backgroundColor: 'action.hover',
                            padding: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography component="h2" variant="h5">
                                {collection.title}
                            </Typography>
                            <IconButton
                                aria-label="excluir coleção"
                                onClick={() => openDeleteModal('collection', collection.id)}
                                disabled={deletingId === `collection-${collection.id}`}
                            >
                                {deletingId === `collection-${collection.id}` ?
                                    <CircularProgress size={24} color="inherit" /> :
                                    <DeleteIcon />
                                }
                            </IconButton>
                        </Box>

                        <CardContent>
                            {collection.links.length === 0 ? (
                                <Typography>Nenhum link nesta coleção.</Typography>
                            ) : (
                                collection.links.map((link) => (
                                    <Box
                                        key={link.id}
                                        sx={{
                                            mb: 2,
                                            pb: 2,
                                            borderBottom: '1px solid #333',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', maxWidth: 'calc(100% - 50px)' }}>
                                            {link.imageUrl && (
                                                <CardMedia
                                                    component="img"
                                                    image={link.imageUrl}
                                                    alt="Preview"
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                        objectFit: 'cover',
                                                        borderRadius: '4px',
                                                        mr: 2,
                                                        flexShrink: 0
                                                    }}
                                                />
                                            )}
                                            <Box>
                                                <MuiLink href={link.url} target="_blank" rel="noopener noreferrer" variant="h6" underline="hover">
                                                    {link.title}
                                                </MuiLink>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
                                                    {link.description}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <IconButton
                                            aria-label="excluir link"
                                            onClick={() => openDeleteModal('link', link.id)}
                                            disabled={deletingId === `link-${link.id}`}
                                            sx={{ ml: 1 }} 
                                        >
                                            {deletingId === `link-${link.id}` ?
                                                <CircularProgress size={24} color="inherit" /> :
                                                <DeleteIcon />
                                            }
                                        </IconButton>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>
                ))
            )}

            <Dialog
                open={isModalOpen}
                onClose={closeDeleteModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        backgroundColor: 'background.paper',
                        color: 'text.primary'
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    Confirmar Exclusão
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" color="text.secondary">
                        {itemToDelete?.type === 'collection'
                            ? 'Tem certeza que quer excluir esta coleção? Todos os links nela serão perdidos permanentemente.'
                            : 'Tem certeza que quer excluir este link?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteModal} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}

export default DashboardPage;