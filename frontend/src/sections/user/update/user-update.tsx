import axios from "axios";
import { useState, useEffect } from "react";

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
} from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    adminData: {
        email: string;
        name: string;
        phone: string;
    };
    showSnackbar: (message: string, severity: 'success' | 'error' | 'warning') => void;

}

export function EditUserDialog({ open, onClose, onSuccess, adminData }: Props) {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
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

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:3000/api/admin/updateAdmin/${adminData.email}`,
                {
                    name: form.name,
                    phone: form.phone,
                    password: form.password || undefined,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            showSnackbar("Admin berhasil diperbarui!", 'success');
            onSuccess();
            onClose();
        } catch (err: any) {
            let message = 'Terjadi kesalahan';
            if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const firstErrorKey = Object.keys(errors)[0];
                message = errors[firstErrorKey];
            }
            showSnackbar(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminData) {
            setForm({
                name: adminData.name || '',
                phone: adminData.phone || '',
                password: '',
            });
        }
    }, [adminData, open]);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth>
                <DialogTitle>Perbarui Data Admin</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Nama"
                            value={form.name}
                            onChange={handleChange('name')}
                        />
                        <TextField
                            label="Nomor HP"
                            value={form.phone}
                            onChange={handleChange('phone')}
                        />
                        <TextField
                            label="Password Baru"
                            type="password"
                            value={form.password}
                            onChange={handleChange('password')}
                            placeholder="Kosongkan jika tidak diubah"
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
