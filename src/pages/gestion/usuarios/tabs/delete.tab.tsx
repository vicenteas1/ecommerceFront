import { useEffect, useState } from "react";
import { listUsers, deleteUser } from "../../../../services/user/user.service";
import type { SafeUser } from "../../../../models/services/user/user.model";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, LinearProgress, Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteUsersTab() {
  const [rows, setRows] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<SafeUser | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try { setRows(await listUsers()); }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  function askDelete(u: SafeUser) {
    setCurrent(u);
    setMsg(null);
    setOpen(true);
  }

  async function confirmDelete() {
    if (!current) return;
    try {
      await deleteUser(current.id);
      setOpen(false);
      await refresh();
    } catch (err: any) {
      setMsg(err?.message ?? "No se pudo eliminar");
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
                <IconButton color="error" onClick={() => askDelete(u)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Eliminar usuario</DialogTitle>
        <DialogContent dividers>
          {msg && <Alert severity="error" sx={{ mb: 2 }}>{msg}</Alert>}
          ¿Seguro que deseas eliminar al usuario <strong>{current?.username}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
