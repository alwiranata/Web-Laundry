import {
  Stack,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  email: string;
  name: string; // tambahkan props untuk nama admin
}

export function OrderDetailDialog({ open, onClose, email, name }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Detail Transaksi</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            fullWidth
            label="Nama Admin"
            value={name}
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="Email Admin"
            value={email}
            InputProps={{ readOnly: true }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
}
