import axios from "axios";
import { useState } from "react";

import {
  Alert,
  Dialog,
  Button,
  Snackbar,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning') => void;
  selectedCount: number;
}

export function DeleteAllAdminDialog({
  open,
  onClose,
  onSuccess,
  showSnackbar,
  selectedCount,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        "http://localhost:3000/api/admin/deleteAllAdmin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar(res.data.message, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Gagal menghapus semua admin.';
      showSnackbar(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Konfirmasi Hapus Semua Admin</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menghapus <strong>{selectedCount}</strong> admin yang dipilih?
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <Button
            onClick={handleDeleteAll}
            disabled={loading}
            variant="contained"
            color="error"
          >
            {loading ? 'Menghapus...' : 'Hapus Semua'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
