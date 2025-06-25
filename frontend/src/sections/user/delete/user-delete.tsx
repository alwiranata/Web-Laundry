import axios from 'axios';
import { useState } from 'react';

import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning') => void;
  email: string;
  currentUserEmail: string;
};

export function DeleteAdminDialog({ open, onClose, onSuccess, email, currentUserEmail, showSnackbar }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (email === currentUserEmail) {
      showSnackbar('Tidak bisa menghapus akun sendiri!', 'warning');
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:3000/api/admin/deleteAdmin/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showSnackbar('Admin berhasil dihapus!', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      let message = 'Terjadi kesalahan saat menghapus admin.';
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Hapus Admin <strong>{email}</strong> ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          color="error"
          variant="contained"
        >
          {loading ? 'Menghapus...' : 'Hapus'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
