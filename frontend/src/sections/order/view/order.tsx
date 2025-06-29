import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  Alert,
  Button,
  Snackbar,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { OrderTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { NewOrderDialog } from '../create/order-create';
import { OrderTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

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
  price: number;
  admin: {
    email: string;
    name : string
  };
};

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('uniqueCode');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback((id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  }, [order, orderBy]);

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }, []);

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback((_event: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSort,
    onSelectRow,
    onSelectAllRows,
    onChangePage,
    onChangeRowsPerPage,
    onResetPage,
  };
}

export function OrderView() {
  const table = useTable();
  const [orders, setOrders] = useState<RowProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/order/getAll', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped: RowProps[] = res.data.data.map((order: any) => ({
        id: order.id,
        uniqueCode: order.uniqueCode,
        serviceType: order.serviceType,
        serviceCategory: order.serviceCategory,
        priceCategory: order.priceCategory,
        category: order.category,
        weight: order.weight,
        pickUpDate: order.pickUpDate,
        dropOffDate: order.dropOffDate,
        status: order.status,
        price: order.price,
        admin: {
          email: order.admin?.email || '-', 
          name: order.admin?.name || '-', // Tambahkan ini
// Tambahkan ini
        },
      }));

      setOrders(mapped);
    } catch (error) {
      console.error('Gagal mengambil data orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Order
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenDialog(true)}
        >
          New Order
        </Button>
      </Box>

      <Card>
        <OrderTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          showSnackbar={showSnackbar}
          onSuccess={() => {
            fetchOrders();
            table.onSelectAllRows(false, []);
          }}
        />


        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={orders.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, orders.map((a) => a.uniqueCode))
                }
                headLabel={[
                  { id: 'uniqueCode', label: 'Kode Unik' },
                  { id: 'serviceType', label: 'Layanan' },
                  { id: 'serviceCategory', label: 'Kategori' },
                  { id: 'priceCategory', label: 'Harga (Kategori)' },
                  { id: 'category', label: 'Jenis' },
                  { id: 'weight', label: 'Berat(Kg)' },
                  { id: 'pickUpDate', label: 'Antar' },
                  { id: 'pickOffDate', label: 'Ambil' },
                  { id: 'status', label: 'Status' },
                  { id: 'price', label: 'Total(Rp)' },
                  { id: '', label: '' },
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OrderTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.uniqueCode)}
                      onSelectRow={() => table.onSelectRow(row.uniqueCode)}
                      onSuccess={fetchOrders}
                      showSnackbar={showSnackbar}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, orders.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={orders.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Dialog Tambah Order */}
      <NewOrderDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={() => {
          setOpenDialog(false);
          fetchOrders();
        }}
      />

      {/* Snackbar Notifikasi */}
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
    </DashboardContent>
  );
}
