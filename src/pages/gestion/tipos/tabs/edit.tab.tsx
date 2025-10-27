import { useEffect, useState } from "react";
import {
  Box, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress, Alert,
  Paper,
  LinearProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getTypes, updateType } from "../../../../services/type/type.service";
import type { Type } from "../../../../models/services/type/types.model";

export default function EditTypeTab() {
  const [items, setItems] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id?: string; nombre?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const handleOpen = (t: Type) => {
    setEditing({ id: t.id, nombre: t.nombre });
    setSaveError(null);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editing.id) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateType(editing.id, { nombre: editing.nombre ?? "" });
      setOpen(false);
      await load();
    } catch (err: any) {
      setSaveError(err?.response?.data?.message ?? "No se pudo actualizar el tipo");
    } finally {
      setSaving(false);
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
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.nombre}</TableCell>
              <TableCell>{t.slug}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => handleOpen(t)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={3} align="center">No hay tipos</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar tipo</DialogTitle>
        <DialogContent>
          {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}

          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={editing.nombre ?? ""}
            onChange={(e) => setEditing((prev) => ({ ...prev, nombre: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
