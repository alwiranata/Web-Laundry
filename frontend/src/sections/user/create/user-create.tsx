import axios from 'axios';
import { useState } from 'react';

import {
    Stack,
    Alert,
    Dialog,
    Button,
    Snackbar,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function NewUserDialog({ open, onClose, onSuccess }: Props) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const token = localStorage.getItem('token');

            await axios.post(
                'http://localhost:3000/api/admin/register',
                {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    password: form.password,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            showSnackbar('Admin berhasil ditambahkan!', 'success');
            onSuccess();
            onClose();
        } catch (err: any) {
            let message = 'Terjadi kesalahan';

            if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const firstErrorKey = Object.keys(errors)[0];
                message = errors[firstErrorKey]; // tampilkan hanya "Email Tidak valid!" misalnya
            }

            showSnackbar(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth>
                <DialogTitle>Tambah Admin Baru</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField label="Nama" value={form.name} onChange={handleChange('name')} />
                        <TextField label="Email" value={form.email} onChange={handleChange('email')} />
                        <TextField label="Nomor HP" value={form.phone} onChange={handleChange('phone')} />
                        <TextField
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={handleChange('password')}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Batal</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        variant="contained"
                        color="primary"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogActions>

            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
