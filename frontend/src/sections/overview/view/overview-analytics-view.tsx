import axios from 'axios';
import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
// ----------------------------------------------------------------------


export function OverviewAnalyticsView() {
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0)
  const [myPrice , setMyPrice] = useState(0)
  const [name ,setName]  = useState("")

 useEffect(() => {
  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const resOrder = await axios.get('http://localhost:3000/api/order/getAll', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalPendapatan(resOrder.data.allPrices || 0);
      setTotalOrder(resOrder.data.orders || 0);
    } catch (error) {
      console.error('Gagal ambil data statistik:', error);
    }
  };

  fetchOrder();
}, []);


  useEffect(() => {
    const fetchAllAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/admin/getAllProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalAdmin(res.data.length)
      } catch (err) {
        console.error('Gagal mengambil data semua admin:', err);
      }
    };
    fetchAllAdmins();
  }, []);

 useEffect(() => {
  const fetchMyPrice = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/admin/getProfile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPrice(res.data.myPrice || 0);
      setName(res.data.name || "")
    } catch (error) {
      console.error('Gagal mengambil myPrice:', error);
    }
  };

  fetchMyPrice();
}, []);
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
       {name}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Transaksi"
            percent={2.6}
            total={totalOrder}
            icon={<img alt="Weekly sales" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Jumlah Admin"
            percent={13}
            total={totalAdmin}
            color="secondary"
            icon={<img alt="New users" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Pendapatan"
            percent={2.8}
            total={totalPendapatan}
            color="warning"
            icon={<img alt="Purchase orders" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Pendapatan Saya"
            percent={3.6}
            total={myPrice}
            color="error"
            icon={<img alt="Messages" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
