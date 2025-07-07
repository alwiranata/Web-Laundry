import React from 'react';

import {
  Box,
  Chip,
  Stack,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  status: string;
  statusPayment: string;
}

// Komponen StatusChip
const StatusChip = ({ status }: { status: string }) => {
  switch (status) {
    case 'PENDING':
      return <Chip label="Ditunda" color="warning" variant="outlined" />;
    case 'IN_PROGRESS':
      return <Chip label="Diproses" color="info" variant="outlined" />;
    case 'COMPLETED':
      return <Chip label="Diselesaikan" color="success" variant="outlined" />;
    case 'CANCELLED':
      return <Chip label="DiBatalkan" color="error" variant="outlined" />;
    default:
      return <Chip label={status} variant="outlined" />;
  }
};

const PaymentChip = ({ status }: { status: string }) => {
  switch (status) {
    case 'PENDING':
      return <Chip label="Belum Dibayar" color="error" variant="outlined" />;
    case 'COMPLETED':
      return <Chip label="Lunas" color="success" variant="outlined" />;
    default:
      return <Chip label={status} variant="outlined" />;
  }
};

// Komponen detail info
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) => (
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

export function OrderStatusDialog({
  open,
  onClose,
  status,
  statusPayment,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Status</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ p: 1 }}>

          <DetailItem label="Status Pengerjaan" value={<StatusChip status={status} />} />
          <DetailItem label="Status Pembayaran" value={<PaymentChip status={statusPayment} />} />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}  variant='contained'>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
