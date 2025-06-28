import axios from "axios";
import { useState } from "react";

import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  uniqueCode: string;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning') => void;
};

export function DeleteOrderDialog({ open, onClose, onSuccess, uniqueCode, showSnackbar }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/api/order/delete/${uniqueCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showSnackbar("Order berhasil dihapus", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      let message = "Terjadi kesalahan saat menghapus order.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstErrorKey = Object.keys(errors)[0];
        message = errors[firstErrorKey];
      }
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Apakah kamu yakin ingin menghapus order <strong>{uniqueCode}</strong>?
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
          {loading ? "Menghapus..." : "Hapus"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
