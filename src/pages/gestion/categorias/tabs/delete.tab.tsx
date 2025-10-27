import { useEffect, useMemo, useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Alert, Typography, Chip, Box, LinearProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteCategory, getCategories } from "../../../../services/categories/categories.service";
import { getTypes } from "../../../../services/type/type.service";
import type { Category } from "../../../../models/services/categories/categories.model";
import type { Type } from "../../../../models/services/type/types.model";

export default function DeleteCategoryTab() {
  const [items, setItems] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [delError, setDelError] = useState<string | null>(null);

  const typeNameById = useMemo(() => {
    const m = new Map<string, string>();
    types.forEach(t => m.set(t.id, t.nombre));
    return m;
  }, [types]);

  const refresh = async () => {
    setLoading(true); setError(null);
    try { setItems(await getCategories()); }
    catch (e: any) { setError(e?.message ?? "Error cargando categorías"); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    (async () => {
      try { setTypes(await getTypes()); }
      finally { setMetaLoading(false); }
    })();
  }, []);

  const askDelete = (c: Category) => {
    setTarget(c); setDelError(null); setOpen(true);
  };

  const onDelete = async () => {
    if (!target) return;
    setDeleting(true); setDelError(null);
    try {
      await deleteCategory(target.id);
      setOpen(false);
      await refresh();
    } catch (err: any) {
      setDelError(err?.response?.data?.message ?? "No se pudo eliminar");
    } finally {
      setDeleting(false);
    }
  };

  if (loading || metaLoading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper sx={{ p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="center">Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(c => {
            const typeId = typeof c.type === "string" ? c.type : c.type?.id;
            const tname = (typeof c.type === "object" ? c.type?.nombre : undefined) ?? (typeId ? typeNameById.get(typeId) : undefined) ?? typeId ?? "-";
            return (
              <TableRow key={c.id}>
                <TableCell sx={{ textTransform: "capitalize" }}>{c.nombre}</TableCell>
                <TableCell><Chip label={tname} /></TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => askDelete(c)} aria-label={`Eliminar ${c.nombre}`}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={3} align="center">No hay categorías</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Eliminar categoría</DialogTitle>
        <DialogContent>
          {delError && <Alert severity="error" sx={{ mb: 2 }}>{delError}</Alert>}
          <Typography>¿Seguro que deseas eliminar <strong>{target?.nombre}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={deleting}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={onDelete} disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
