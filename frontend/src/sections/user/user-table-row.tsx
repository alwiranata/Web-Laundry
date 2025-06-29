import { useState, useCallback } from 'react';

import {
  Popover,
  TableRow,
  Checkbox,
  MenuList,
  MenuItem,
  TableCell,
  IconButton,
  menuItemClasses,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { EditUserDialog } from './update/user-update';
import { DeleteAdminDialog } from './delete/user-delete';

export type RowProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

type UserTableRowProps = {
  row: RowProps;
  selected: boolean;
  onSelectRow: () => void;
  onSuccess: () => void;
  currentUserEmail?: string;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning') => void;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onSuccess,
  currentUserEmail,
  showSnackbar,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [openDelete, setOpenDelete] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    setEditDialogOpen(true);
    handleClosePopover();
  };


  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleTogglePassword = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.phone}</TableCell>

        <TableCell sx={{ width: 180, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          {visiblePasswords[row.id]
            ? row.password.slice(0, 9)
            : '•'.repeat(Math.min(9, row.password.length))}
          <IconButton
            size="small"
            onClick={() => handleTogglePassword(row.id)}
            sx={{ ml: 1 }}
          >
            <Iconify
              icon={visiblePasswords[row.id] ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
            />
          </IconButton>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

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
          <MenuItem onClick={handleEditClick} sx={{color : "info.main"}}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              setOpenDelete(true);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Hapus
          </MenuItem>
        </MenuList>
      </Popover>

      <DeleteAdminDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        email={row.email}
        onSuccess={onSuccess}
        currentUserEmail={currentUserEmail ?? ''}
        showSnackbar={showSnackbar}
      />


      <EditUserDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={onSuccess}
        showSnackbar={showSnackbar}
        adminData={{
          email: row.email,
          name: row.name,
          phone: row.phone,
        }}
      />

    </>
  );
}
