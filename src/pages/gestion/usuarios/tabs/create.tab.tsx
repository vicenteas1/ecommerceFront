import { useState } from "react";
import {
  Paper, TextField, Button, MenuItem,
  Alert, LinearProgress
} from "@mui/material";
import type { CreateUserDTO, UserRole } from "../../../../models/services/user/user.model";
import { createUser } from "../../../../services/user/user.service";

export default function CreateUsersTab() {
  const [form, setForm] = useState<Partial<CreateUserDTO & { passwordConfirm?: string }>>({
    role: "buyer",
  });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    setError(null);

    if (!form.username?.trim()) return setError("El usuario es obligatorio.");
    if (!form.email?.trim()) return setError("El email es obligatorio.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Email inválido.");
    if (!form.password || form.password.length < 8)
      return setError("La contraseña debe tener al menos 8 caracteres.");
    if (form.password !== form.passwordConfirm)
      return setError("La confirmación de contraseña no coincide.");

    setLoading(true);
    try {
      const payload: CreateUserDTO = {
        username: form.username!.trim(),
        email: form.email!.trim(),
        role: (form.role as UserRole) ?? "buyer",
        password: form.password!,
      };
      const created = await createUser(payload);
      setOk(`Usuario "${created.username}" creado.`);
      setForm({ role: "buyer" }); // limpiar
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "No se pudo crear el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper component="form" onSubmit={onSubmit} sx={{ p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Usuario"
        value={form.username ?? ""}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        fullWidth required margin="normal"
      />
      <TextField
        label="Email"
        type="email"
        value={form.email ?? ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        fullWidth required margin="normal"
      />
      <TextField
        select
        label="Rol"
        value={(form.role as UserRole) ?? "buyer"}
        onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
        fullWidth required margin="normal"
      >
        <MenuItem value="buyer">buyer</MenuItem>
        <MenuItem value="admin">admin</MenuItem>
      </TextField>
      <TextField
        label="Contraseña"
        type="password"
        value={form.password ?? ""}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        fullWidth required margin="normal"
      />
      <TextField
        label="Confirmar contraseña"
        type="password"
        value={form.passwordConfirm ?? ""}
        onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
        fullWidth required margin="normal"
      />
      <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
        {loading ? "Creando..." : "Crear usuario"}
      </Button>
    </Paper>
  );
}
