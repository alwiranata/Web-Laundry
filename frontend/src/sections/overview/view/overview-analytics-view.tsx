import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
// ----------------------------------------------------------------------


export function OverviewAnalyticsView() {
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0)
  const [myPrice, setMyPrice] = useState(0)
  const [name, setName] = useState("")
  const [monthlyIncome, setMonhtlyIncome] = useState<number[]>([])
  const [yearlySummary, setYearlySummary] = useState<{ year: string; total: number }[]>([]);

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
        setMonhtlyIncome(resOrder.data.monthlyIncome || [])
        if (
          Array.isArray(resOrder.data.yearlySummary) &&
          typeof resOrder.data.yearlySummary[0] === 'object'
        ) {
          setYearlySummary(resOrder.data.yearlySummary);
        } else {
          console.warn("yearlySummary bukan array of object:", resOrder.data.yearlySummary);
        } // 👈 tambahkan ini


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
            isCurrency = {true}
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
            isCurrency = {true}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>


        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardHeader title="Pendapatan per Tahun" />
            <List
              sx={{
                maxHeight: 390, // Atur tinggi maksimal
                overflowY: 'auto', // Aktifkan scroll vertikal jika konten melebihi tinggi
              }}
            >
              {yearlySummary.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Tahun {item.year}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Rp {item.total.toLocaleString('id-ID')}
                  </Typography>
                </ListItem>
              ))}
            </List>

          </Card>
        </Grid>


        <Grid size={{ xs: 12, md: 6, lg: 8 }} >
          <AnalyticsWebsiteVisits
            title="Pendapatan per bulan"
            subheader="Tahun 2025"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agus', 'Sep', 'Okt', 'Nov', 'Des'],
              series: [
                { name: 'Pendapatan', data: monthlyIncome },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
