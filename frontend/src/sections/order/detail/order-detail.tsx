import {
  Stack,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  email: string;
  name: string;
}

export function OrderDetailDialog({ open, onClose, email, name }: Props) {


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Detail Transaksi</DialogTitle>

      <DialogContent>
        <div>
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
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='contained'>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
}
