import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { DeleteAllOrderDialog } from './deleteAll/order-deleteAll';

type OrderTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning') => void;
  onSuccess: () => void;
};

export function OrderTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  showSnackbar,
  onSuccess,
}: OrderTableToolbarProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} terpilih
          </Typography>
        ) : (
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Cari Kode..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
        )}

        {numSelected > 0 ? (
          <Tooltip title="Hapus Semua">
            <IconButton color="error" onClick={() => setOpenDeleteDialog(true)}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter daftar">
            <IconButton>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <DeleteAllOrderDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        selectedCount={numSelected}
        showSnackbar={showSnackbar}
        onSuccess={() => {
          setOpenDeleteDialog(false);
          onSuccess(); // refetch data
        }}
      />
    </>
  );
}
