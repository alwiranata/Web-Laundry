import { useState, useCallback } from 'react';

import {
  Popover,
  TableRow,
  MenuList,
  MenuItem,
  TableCell,
  IconButton,
  menuItemClasses,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { OrderDetailDialog } from './detail/order-detail';
import { OrderStatusDialog } from './status/order-status';

export type RowProps = {
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
  admin: {
    email: string;
    name: string;
  };
};

type OrderTableRowProps = {
  row: RowProps;
  selected: boolean;
  onSelectRow: () => void;
  onSuccess: () => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning') => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(value: number) {
  return `${value.toLocaleString('id-ID')}`;
}

export function OrderTableRow({
  row,
  selected,
}: OrderTableRowProps) {
  const [openPopover, setOpenPopover] = useState<null | HTMLElement>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{row.uniqueCode}</TableCell>
        <TableCell>{row.serviceType}</TableCell>
        <TableCell>{row.serviceCategory}</TableCell>
        <TableCell>{formatCurrency(row.priceCategory)}</TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>{row.weight}</TableCell>
        <TableCell>{formatDate(row.dropOffDate)}</TableCell>
        <TableCell>{formatDate(row.pickUpDate)}</TableCell>

        {/* ✅ Satu tombol untuk buka dialog status */}
        <TableCell>
          <IconButton onClick={() => setOpenStatusDialog(true)}>
           <Iconify icon="solar:info-circle-bold" />

          </IconButton>
        </TableCell>

        <TableCell>{formatCurrency(row.price)}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Popover detail */}
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setOpenDetailDialog(true);
              handleClosePopover();
            }}
          >
            <Iconify icon="solar:settings-bold-duotone" />
            Detail
          </MenuItem>
        </MenuList>
      </Popover>

      {/* Dialog untuk Detail */}
      <OrderDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        email={row.admin?.email ?? '-'}
        name={row.admin?.name ?? '-'}
      />

      {/* ✅ Dialog untuk Status */}
      <OrderStatusDialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        status={row.status}
        statusPayment={row.statusPayment}
      />
    </>
  );
}
