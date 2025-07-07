import axios from 'axios';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import laundryIcon from '@iconify-icons/mdi/washing-machine';

import {
  Box,
  Alert,
  Button,
  Avatar,
  Snackbar,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import { OrderDetailDialog } from './detail/landing-page-detail';

interface Order {
  id: number;
  uniqueCode: string;
  serviceType: string;
  serviceCategory: string;
  priceCategory: number;
  category: string;
  weight: number;
  pickUpDate: string;
  dropOffDate: string;
  status: string;
  statusPayment: string;
  price: number;
  createdAt: string;
}

export default function LandingPage() {
  const [uniqueCode, setUniqueCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSearch = async () => {
    if (!uniqueCode.trim()) {
      showSnackbar('Kode unik tidak boleh kosong.', 'error');
      return;
    }

    
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/order/get/${uniqueCode}`);
      const data = res.data.order;

      if (data && data.length > 0) {
        const order = data[0];
        setSelectedOrder({
          id: order.id_order,
          uniqueCode: order.uniqueCode,
          serviceType: order.serviceType,
          serviceCategory: order.serviceCategory,
          priceCategory: order.priceCategory,
          category: order.category,
          weight: order.weight,
          pickUpDate: order.pickUpDate,
          dropOffDate: order.dropOffDate,
          status: order.status,
          statusPayment: order.statusPayment,
          price: order.price,
          createdAt: order.createdAt,
        });
        setOpenDialog(true);
        showSnackbar('Order ditemukan.', 'success');
      } else {
        setSelectedOrder(null);
        setOpenDialog(false);
        showSnackbar('Order tidak ditemukan.', 'error');
      }
    } catch (err: any) {
      setSelectedOrder(null);
      setOpenDialog(false);
      showSnackbar(err.response?.data?.message || 'Gagal mengambil data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 60, height: 60 }}>
          <Icon icon={laundryIcon} width={36} height={36} />
        </Avatar>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Cek Status Laundry
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Masukkan kode unik yang Anda terima dari admin untuk melihat status pesanan Anda.
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          label="Kode Unik"
          value={uniqueCode}
          onChange={(e) => setUniqueCode(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Cari'}
        </Button>

        {/* Dialog Detail Order */}
        <OrderDetailDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          order={selectedOrder}
        />
      </Container>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
