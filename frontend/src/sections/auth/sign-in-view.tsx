import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const [searchParams] = useSearchParams();

  // Auto-login jika ada token dan email dari query string
  useEffect(() => {
    const token = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    if (token && urlEmail) {
      localStorage.setItem('token', token);
      localStorage.setItem('email', urlEmail);
      window.location.href = '/beranda';
    }
  }, [searchParams]);

  const handleSignIn = useCallback(async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/admin/login', {
        email,
        password,
      });

      const { token, email: loggedInEmail } = res.data;

      if (token && loggedInEmail) {
        localStorage.setItem('token', token);
        localStorage.setItem('email', loggedInEmail);

        setAlertSeverity('success');
        setAlertMessage('Login berhasil!');
        setAlertOpen(true);

        setTimeout(() => {
          window.location.href = '/beranda';
        }, 1000);
      } else {
        throw new Error('Token atau email tidak ditemukan.');
      }
    } catch (error: any) {
      setAlertSeverity('error');
      setAlertMessage(error.response?.data?.message || 'Email atau password salah!');
      setAlertOpen(true);
    }
  }, [email, password]);

  return (
    <>
      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
        <Typography variant="h5">Login</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Don’t have an account?
          <Link href="/" variant="subtitle2" sx={{ ml: 0.5 }}>
            Register
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

      <Box sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
        <TextField
          fullWidth
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          Forgot password?
        </Link>

        <TextField
          fullWidth
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          onClick={handleSignIn}
        >
          Login
        </Button>
      </Box>

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>
          OR
        </Typography>
      </Divider>

      <Box sx={{ gap: 1, display: 'flex', justifyContent: 'center' }}>
        {/* Google */}
        <IconButton
          color="inherit"
          onClick={() => {
            window.location.href = 'http://localhost:3000/api/auth/google';
          }}
        >
          <Iconify width={22} icon="socials:google" />
        </IconButton>

        {/* GitHub */}
        <IconButton
          color="inherit"
          onClick={() => {
            window.location.href = 'http://localhost:3000/api/auth/github';
          }}
        >
          <Iconify width={22} icon="socials:github" />
        </IconButton>
      </Box>
    </>
  );
}
