import { useEffect, useState } from "react";
import {
  Box, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Alert, Typography,
  Paper,
  LinearProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getTypes, deleteType } from "../../../../services/type/type.service";
import type { Type } from "../../../../models/services/type/types.model";

export default function DeleteTypeTab() {
  const [items, setItems] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState<Type | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTypes();
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando tipos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const askDelete = (t: Type) => {
    setTarget(t);
    setDeleteError(null);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!target) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteType(target.id);
      setConfirmOpen(false);
      await load();
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message ?? "No se pudo eliminar");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper sx={{ p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell align="center">Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.nombre}</TableCell>
              <TableCell>{t.slug}</TableCell>
              <TableCell align="center">
                <IconButton color="error" onClick={() => askDelete(t)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={3} align="center">No hay tipos</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Eliminar tipo</DialogTitle>
        <DialogContent>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <Typography>
            ¿Seguro que deseas eliminar <strong>{target?.nombre}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
