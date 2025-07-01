import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

export function ProfileView() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/api/admin/getProfile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { name, email, phone } = res.data.profile;

                setProfile({
                    name,
                    email,
                    phone: phone || '',
                    password: '',
                });
            } catch (err: any) {
                setAlertSeverity('error');
                setAlertMessage(err.response?.data?.message || 'Gagal mengambil data profil');
                setAlertOpen(true);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');

            await axios.put(
                `http://localhost:3000/api/admin/updateAdmin/${profile.email}`,
                {
                    name: profile.name,
                    phone: profile.phone,
                    password: profile.password || undefined,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setAlertSeverity('success');
            setAlertMessage('Profil berhasil diperbarui');
            setAlertOpen(true);
            setEditing(false);

            // ⏱️ Tambahkan timeout: 2 detik alert, lalu 2 detik reload
            setTimeout(() => {
                setAlertOpen(false);
                setTimeout(() => {
                    window.location.reload(); // Refresh halaman
                }, 2000);
            }, 2000); // Alert muncul selama 2 detik

        } catch (err: any) {
            setAlertSeverity('error');
            setAlertMessage(err.response?.data?.message || 'Gagal menyimpan perubahan');
            setAlertOpen(true);
        }
    };


    return (
        <>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <IconButton onClick={() => navigate('/beranda')}>
                    <Iconify icon="mingcute:arrow-left-line" width={24} height={24} />
                </IconButton>
            </Box>

            <Box
                sx={{
                    gap: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 5,
                }}
            >
                <Avatar
                    src="/assets/images/avatar-placeholder.png"
                    sx={{ width: 80, height: 80, mt: 1 }}
                />
                <Typography variant="h5">Profil</Typography>
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
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    sx={{ mb: 2 }}
                    disabled={!editing}
                />

                <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    sx={{ mb: 2 }}
                    disabled
                />

                <TextField
                    fullWidth
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    sx={{ mb: 2 }}
                    disabled={!editing}
                />

                <TextField
                    fullWidth
                    label="Password Baru (Opsional)"
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    type={showPassword ? 'text' : 'password'}
                    disabled={!editing}
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

                {!editing ? (
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        color="inherit"
                        onClick={() => setEditing(true)}
                    >
                        Edit Profil
                    </Button>
                ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Simpan
                        </Button>
                        <Button
                            fullWidth
                            size="large"
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                                setEditing(false);
                                setProfile({ ...profile, password: '' });
                            }}
                        >
                            Batal
                        </Button>
                    </Box>
                )}
            </Box>
        </>
    );
}
