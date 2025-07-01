import { SvgColor } from 'src/components/svg-color';
import { ShoppingCart } from 'lucide-react';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Beranda',
    path: '/beranda',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Data Admin',
    path: '/data-admin',
    icon: icon('ic-user'),
  },
  {
    title : "Data Transaksi",
    path :  '/data-transaksi',
    icon : icon('ic-cart'),
  },
  {
    title : "Transaksi ",
    path :  '/transaksi',
    icon : icon('ic-my-order')
  },
  
];
