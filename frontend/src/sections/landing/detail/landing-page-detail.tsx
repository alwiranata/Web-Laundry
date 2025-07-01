import React from 'react';

import {
  Box,
  Chip,
  Stack,
  Dialog,
  Button,
  Divider,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

export interface Order {
  id: number;
  uniqueCode: string;
  serviceType: string;
  serviceCategory: string;
  priceCategory: number | string;
  category: string;
  weight: number;
  pickUpDate: string;
  dropOffDate: string;
  status: string;
  price: number;
  createdAt?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const StatusChip = ({ status }: { status: string }) => {
  switch (status) {
    case 'PENDING':
      return <Chip label="Tunda" color="warning" variant="outlined" />;
    case 'IN_PROGRESS':
      return <Chip label="Proses" color="info" variant="outlined" />;
    case 'COMPLETED':
      return <Chip label="Selesai" color="success" variant="outlined" />;
    case 'CANCELLED':
      return <Chip label="Batal" color="error" variant="outlined" />;
    default:
      return <Chip label={status} variant="outlined" />;
  }
};


const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();


  return `${day} - ${month} - ${year}  `;
};


const DetailItem = ({ label, value }: { label: string; value: string | number | React.ReactNode }) => (
  <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
    <Typography variant="body1" fontWeight={500}>
      {label}
    </Typography>
    <Box textAlign="right" sx={{ maxWidth: '60%' }}>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography variant="body1">{value}</Typography>
      ) : (
        value
      )}
    </Box>
  </Stack>
);

export function OrderDetailDialog({ open, onClose, order }: Props) {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Detail Transaksi</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            LaundryCare - Bukti Transaksi
          </Typography>

          <Divider sx={{ my: 1 }} />

          <DetailItem label="Kode Unik" value={order.uniqueCode} />
          <DetailItem label="Layanan" value={order.serviceType} />
          <DetailItem label="Kategori" value={order.serviceCategory} />
          <DetailItem label="Harga (Kategori)" value={`Rp ${order.priceCategory}`} />
          <DetailItem label="Jenis" value={order.category} />
          <DetailItem label="Berat" value={`${order.weight} Kg`} />
          <DetailItem label="Tanggal Antar" value={formatDate(order.dropOffDate)} />
          <DetailItem label="Tanggal Ambil" value={formatDate(order.pickUpDate)} />
          <DetailItem label="Status" value={<StatusChip status={order.status} />} />
          <Divider sx={{ my: 1 }} />
          <DetailItem label="Total Biaya" value={`Rp ${order.price.toLocaleString()}`} />

          {order.createdAt && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" fontSize={15} color="text.secondary">
                Dibuat pada: {formatDate(order.createdAt)}
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
