import { useEffect, useState } from "react";
import { listUsers, updateUser } from "../../../../services/user/user.service";
import type { SafeUser, UpdateUserDTO, UserRole } from "../../../../models/services/user/user.model";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, LinearProgress, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function EditUsersTab() {
  const [rows, setRows] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<SafeUser | null>(null);
  const [form, setForm] = useState<UpdateUserDTO>({});
  const [msg, setMsg] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try { setRows(await listUsers()); }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  function handleOpen(u: SafeUser) {
    setCurrent(u);
    setForm({ username: u.username, email: u.email, role: u.role });
    setMsg(null);
    setOpen(true);
  }

  async function handleSave() {
    if (!current) return;
    try {
      await updateUser(current.id, form);
      setMsg(null);
      setOpen(false);
      await refresh();
    } catch (err: any) {
      setMsg(err?.message ?? "No se pudo actualizar");
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpen(u)}><EditIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar usuario</DialogTitle>
        <DialogContent dividers>
          {msg && <Alert severity="error" sx={{ mb: 2 }}>{msg}</Alert>}
          <TextField label="Usuario" fullWidth margin="normal"
            value={form.username ?? ""} onChange={e => setForm({ ...form, username: e.target.value })}/>
          <TextField label="Email" type="email" fullWidth margin="normal"
            value={form.email ?? ""} onChange={e => setForm({ ...form, email: e.target.value })}/>
          <TextField label="Rol" select fullWidth margin="normal"
            value={form.role ?? "buyer"} onChange={e => setForm({ ...form, role: e.target.value as UserRole })}>
            <MenuItem value="buyer">buyer</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
