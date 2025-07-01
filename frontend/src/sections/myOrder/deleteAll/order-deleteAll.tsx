import axios from "axios";
import { useState } from "react";

import {
  Dialog,
  Button,
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

export function DeleteAllOrderDialog({
  open,
  onClose,
  onSuccess,
  showSnackbar,
  selectedCount,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        "http://localhost:3000/api/order/deleteAllOrder",
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
        'Gagal menghapus semua order.';
      showSnackbar(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Konfirmasi Hapus Data Transaksi</DialogTitle>
      <DialogContent>
        Apakah Anda yakin ingin menghapus <strong>{selectedCount}</strong> Transaksi yang Anda buat?
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
  );
}
