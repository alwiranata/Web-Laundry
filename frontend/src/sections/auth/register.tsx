import axios from 'axios';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

export function SignUpView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const handleRegister = useCallback(async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/admin/register', {
        name,
        email,
        phone,
        password,
      });

      setAlertSeverity('success');
      setAlertMessage('Pendaftaran berhasil! Silakan login.');
      setAlertOpen(true);

      // Redirect ke login dalam 2 detik
      setTimeout(() => router.push('/sign-in'), 2000);
    } catch (error: any) {
      setAlertSeverity('error');
      setAlertMessage(error.response?.data?.message || 'Pendaftaran gagal!');
      setAlertOpen(true);
    }
  }, [name, email, phone, password, router]);

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Register</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?
          <Link href="/sign-in" variant="subtitle2" sx={{ ml: 0.5 }}>
            Login
          </Link>
        </Typography>
      </Box>

      <Collapse in={alertOpen}>
        <Alert
          severity={alertSeverity}
          onClose={() => setAlertOpen(false)}
          sx={{ mb: 3, width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Collapse>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
          color="inherit"
          onClick={handleRegister}
        >
          Register
        </Button>
      </Box>
    </>
  );
}
