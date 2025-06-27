import axios from "axios";
import { useState } from "react";

import {
    Stack,
    Alert,
    Dialog,
    Button,
    Select,
    MenuItem,
    Snackbar,
    TextField,
    InputLabel,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions,
} from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function NewOrderDialog({ open, onClose, onSuccess }: Props) {
    const [form, setForm] = useState({
        serviceType: "",
        serviceCategory: "",
        priceCategory: "",
        category: "",
        weight: "",
        dropOffDate: "",
        pickUpDate: "",
        status: "",
        price: "",
    });

    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleChange = (field: string) => (e: any) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            // Convert ke ISO string
            const dropOffISO = new Date(form.dropOffDate).toISOString();
            const pickUpISO = new Date(form.pickUpDate).toISOString();

            await axios.post(
                "http://localhost:3000/api/order/create",
                {
                    serviceType: form.serviceType,
                    serviceCategory: form.serviceCategory,
                    priceCategory: Number(form.priceCategory),
                    category: form.category,
                    weight: Number(form.weight),
                    dropOffDate: dropOffISO,
                    pickUpDate: pickUpISO,
                    status: form.status,
                    price: Number(form.price),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            showSnackbar("Order berhasil ditambahkan!", "success");
            onSuccess();
            onClose();
        } catch (err: any) {
            let message = "Terjadi kesalahan";

            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const firstKey = Object.keys(errors)[0];
                message = errors[firstKey];
            } else if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.message) {
                message = err.message;
            }

            showSnackbar(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth>
                <DialogTitle>Tambah Order Baru</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <FormControl fullWidth>
                            <InputLabel>Tipe Servis</InputLabel>
                            <Select
                                value={form.serviceType}
                                label="Tipe Servis"
                                onChange={handleChange("serviceType")}
                            >
                                <MenuItem value="CUCI">CUCI</MenuItem>
                                <MenuItem value="SETRIKA">SETRIKA</MenuItem>
                                <MenuItem value="CUCI_SETRIKA">CUCI + SETRIKA</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Kategori Servis</InputLabel>
                            <Select
                                value={form.serviceCategory}
                                label="Kategori Servis"
                                onChange={handleChange("serviceCategory")}
                            >
                                <MenuItem value="NORMAL">NORMAL</MenuItem>
                                <MenuItem value="EXPRESS">EXPRESS</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Harga Kategori"
                            type="number"
                            value={form.priceCategory}
                            onChange={handleChange("priceCategory")}
                        />

                        <TextField
                            fullWidth
                            label="Kategori"
                            value={form.category}
                            onChange={handleChange("category")}
                        />

                        <TextField
                            fullWidth
                            label="Berat (Kg)"
                            type="number"
                            value={form.weight}
                            onChange={handleChange("weight")}
                        />

                        <TextField
                            fullWidth
                            label="Tanggal Antar"
                            type="date"
                            value={form.dropOffDate}
                            onChange={handleChange("dropOffDate")}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            fullWidth
                            label="Tanggal Jemput"
                            type="date"
                            value={form.pickUpDate}
                            onChange={handleChange("pickUpDate")}
                            InputLabelProps={{ shrink: true }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={form.status}
                                label="Status"
                                onChange={handleChange("status")}
                            >
                                <MenuItem value="PENDING">PENDING</MenuItem>
                                <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Total Harga"
                            type="number"
                            value={form.price}
                            onChange={handleChange("price")}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Batal</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        variant="contained"
                        color="primary"
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
