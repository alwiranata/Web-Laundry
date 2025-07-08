import axios from 'axios';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import {
  Box, Chip, Stack, Dialog, Button, Divider, Typography, DialogTitle, DialogContent, DialogActions,
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
  statusPayment: string;
  price: number;
  createdAt?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`;
};

const StatusChip = ({ status }: { status: string }) => {
  switch (status) {
    case 'PENDING': return <Chip label="Ditunda" color="warning" variant="outlined" />;
    case 'IN_PROGRESS': return <Chip label="Diproses" color="info" variant="outlined" />;
    case 'COMPLETED': return <Chip label="Diselesaikan" color="success" variant="outlined" />;
    case 'CANCELLED': return <Chip label="Dibatalkan" color="error" variant="outlined" />;
    default: return <Chip label={status} variant="outlined" />;
  }
};

const StatusPayment = ({ statusPayment }: { statusPayment: string }) => {
  switch (statusPayment) {
    case 'PENDING': return <Chip label="Belum Dibayar" color="error" variant="outlined" />;
    case 'COMPLETED': return <Chip label="Lunas" color="success" variant="outlined" />;
    default: return <Chip label={statusPayment} variant="outlined" />;
  }
};

const DetailItem = ({ label, value }: { label: string; value: string | number | React.ReactNode }) => (
  <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
    <Typography fontWeight={500}>{label}</Typography>
    <Box textAlign="right" sx={{ maxWidth: '60%' }}>
      {typeof value === 'string' || typeof value === 'number' ? <Typography>{value}</Typography> : value}
    </Box>
  </Stack>
);

export function OrderDetailDialog({ open, onClose, order }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  console.log('printRef.current', printRef.current);

  const handlePrint = useReactToPrint({
    bodyClass: 'print-content',
    pageStyle: '@page {  size: A5 portrait; }',
    // ✅ untuk versi 3.x, kita pakai trigger
    contentRef: printRef,
  });

  const handleBayar = async () => {
    if (!order) return;
    try {
      const res = await axios.post('http://localhost:3000/api/payment', {
        orderId: order.uniqueCode,
        amount: order.price,
      });
      window.location.href = res.data.paymentUrl;
    } catch (err: any) {

      alert(err + 'Gagal memproses pembayaran.');
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>

      <DialogContent dividers>
        <Box ref={printRef} sx={{ p: 2 }}>
          <DialogTitle sx={{ textAlign: "center" }}>Detail Transaksi</DialogTitle>
          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle1">LaundryCare - Bukti Transaksi</Typography>
          {order.createdAt && (
            <Typography variant="caption" color="text.secondary">
              Dibuat pada: {formatDate(order.createdAt)}
            </Typography>
          )}
          <Divider sx={{ my: 1 }} />
          <DetailItem label="Kode Unik" value={order.uniqueCode} />
          <DetailItem label="Layanan" value={order.serviceType} />
          <DetailItem label="Kategori" value={order.serviceCategory} />
          <DetailItem label="Harga (Kategori)" value={`Rp ${order.priceCategory}`} />
          <DetailItem label="Jenis" value={order.category} />
          <DetailItem label="Berat" value={`${order.weight} Kg`} />
          <DetailItem label="Tanggal Antar" value={formatDate(order.dropOffDate)} />
          <DetailItem label="Tanggal Ambil" value={formatDate(order.pickUpDate)} />
          <DetailItem label="Status Pengerjaan" value={<StatusChip status={order.status} />} />
          <DetailItem label="Status Pembayaran" value={<StatusPayment statusPayment={order.statusPayment} />} />
          <Divider sx={{ my: 1 }} />
          <DetailItem label="Total Biaya" value={`Rp ${order.price.toLocaleString()}`} />

        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
        {order.statusPayment === 'PENDING' ? (
          <Button onClick={handleBayar} variant="contained" color="primary">
            Bayar Sekarang
          </Button>
        ) : (
          <Button onClick={handlePrint} variant="contained" color="primary">
            Cetak
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
