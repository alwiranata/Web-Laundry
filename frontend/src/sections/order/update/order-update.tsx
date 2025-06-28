import axios from 'axios';
import { useState, useEffect } from 'react';

import {
  Stack,
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning') => void;
  rowData: any; // gunakan RowProps jika sudah di-import
}

export function EditOrderDialog({ open, onClose, onSuccess, showSnackbar, rowData }: Props) {
  const [form, setForm] = useState({ ...rowData });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ ...rowData });
  }, [rowData]);

  const handleChange = (field: string) => (e: any) => {
    setForm((prev : any) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:3000/api/order/update/${form.uniqueCode}`,
        {
          serviceType: form.serviceType,
          serviceCategory: form.serviceCategory,
          priceCategory: Number(form.priceCategory),
          category: form.category,
          weight: Number(form.weight),
          dropOffDate: new Date(form.dropOffDate).toISOString(),
          pickUpDate: new Date(form.pickUpDate).toISOString(),
          status: form.status,
          price: Number(form.price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showSnackbar('Order berhasil diupdate!', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      let message = 'Terjadi kesalahan';
      if (err.response?.data?.message) message = err.response.data.message;
      showSnackbar(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Order</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <FormControl fullWidth>
            <InputLabel>Tipe Servis</InputLabel>
            <Select
              value={form.serviceType}
              label="Tipe Servis"
              onChange={handleChange('serviceType')}
            >
              <MenuItem value="CUCI">CUCI</MenuItem>
              <MenuItem value="SETRIKA">SETRIKA</MenuItem>
              <MenuItem value="CUCI_SETRIKA">CUCI + SETRIKA</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Kategori Servis</InputLabel>
            <Select
              value={form.serviceCategory}
              label="Kategori Servis"
              onChange={handleChange('serviceCategory')}
            >
              <MenuItem value="NORMAL">NORMAL</MenuItem>
              <MenuItem value="EXPRESS">EXPRESS</MenuItem>
            </Select>
          </FormControl>

          <TextField fullWidth label="Harga Kategori" type="number" value={form.priceCategory} onChange={handleChange('priceCategory')} />
          <TextField fullWidth label="Kategori" value={form.category} onChange={handleChange('category')} />
          <TextField fullWidth label="Berat (Kg)" type="number" value={form.weight} onChange={handleChange('weight')} />
          <TextField fullWidth label="Tanggal Antar" type="date" value={form.dropOffDate.split('T')[0]} onChange={handleChange('dropOffDate')} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth label="Tanggal Jemput" type="date" value={form.pickUpDate.split('T')[0]} onChange={handleChange('pickUpDate')} InputLabelProps={{ shrink: true }} />
          
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={handleChange('status')}>
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            </Select>
          </FormControl>

          <TextField fullWidth label="Total Harga" type="number" value={form.price} onChange={handleChange('price')} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
