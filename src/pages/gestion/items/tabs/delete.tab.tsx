import { useEffect, useState } from "react";
import {
  Box, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Alert, Typography, Paper, LinearProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteItem, getItems, type Item } from "../../../../services/item/item.service";

export default function DeleteItemTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getItems();
      setItems(list);
    } catch (err: any) {
      setError(err?.message ?? "Error cargando ítems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const askDelete = (it: Item) => {
    setTarget(it);
    setDeleteError(null);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!target) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteItem(target.id);
      setConfirmOpen(false);
      await load();
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message ?? "No se pudo eliminar");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;
  if (error)   return <Alert severity="error">{error}</Alert>;

  return (
    <Paper sx={{ p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell align="center">Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((it) => (
            <TableRow key={it.id}>
              <TableCell>{it.nombre}</TableCell>
              <TableCell>{it.descripcion}</TableCell>
              <TableCell>${it.precio.toLocaleString("es-CL")}</TableCell>
              <TableCell align="center">
                <IconButton color="error" onClick={() => askDelete(it)} aria-label={`Eliminar ${it.nombre}`}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={4} align="center">No hay ítems</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Eliminar ítem</DialogTitle>
        <DialogContent>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <Typography>¿Seguro que deseas eliminar <strong>{target?.nombre}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting || !target}>
            {deleting ? "Eliminando..." : `Eliminar${target ? ` "${target.nombre}"` : ""}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
