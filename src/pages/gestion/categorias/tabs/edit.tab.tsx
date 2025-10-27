import { useEffect, useMemo, useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, CircularProgress, Alert, Chip, Box, LinearProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { Type } from "../../../../models/services/type/types.model";
import type { Category } from "../../../../models/services/categories/categories.model";
import { getCategories, updateCategory } from "../../../../services/categories/categories.service";
import { getTypes } from "../../../../services/type/type.service";

export default function EditCategoryTab() {
  const [items, setItems] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id?: string; nombre?: string; typeId?: string }>({});
  const [original, setOriginal] = useState<{ id?: string; nombre?: string; typeId?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const typeNameById = useMemo(() => {
    const m = new Map<string, string>();
    types.forEach(t => m.set(t.id, t.nombre));
    return m;
  }, [types]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    (async () => {
      try {
        const tps = await getTypes();
        setTypes(tps ?? []);
      } catch (e) {
        console.error("Error cargando tipos:", e);
      } finally {
        setMetaLoading(false);
      }
    })();
  }, []);

  const openEdit = (c: Category) => {
    const tId = typeof c.type === "string" ? c.type : c.type?.id;
    const next = { id: c.id, nombre: c.nombre, typeId: tId };
    setEditing(next);
    setOriginal(next);
    setSaveError(null);
    setOpen(true);
  };

  const hasChanges =
    (editing.nombre ?? "") !== (original.nombre ?? "") ||
    (editing.typeId ?? "") !== (original.typeId ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(editing.id);
    if (!editing.id) return;
    if (!editing.nombre?.trim()) {
      setSaveError("El nombre es obligatorio.");
      return;
    }
    if (!editing.typeId) {
      setSaveError("Selecciona un tipo.");
      return;
    }
    if (!hasChanges) {
      setSaveError("No hay cambios para guardar.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      await updateCategory(editing.id, {
        nombre: editing.nombre.trim(),
        typeId: editing.typeId,
      });
      setOpen(false);
      await refresh();
    } catch (err: any) {
      console.error("updateCategory error:", err);
      setSaveError(
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo actualizar la categoría"
      );
    } finally {
      setSaving(false);
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
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(c => {
            const typeId = typeof c.type === "string" ? c.type : c.type?.id;
            const tname =
              (typeof c.type === "object" ? c.type?.nombre : undefined) ??
              (typeId ? typeNameById.get(typeId) : undefined) ??
              typeId ?? "-";
            return (
              <TableRow key={c.id}>
                <TableCell sx={{ textTransform: "capitalize" }}>{c.nombre}</TableCell>
                <TableCell><Chip label={tname} /></TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => openEdit(c)}
                    aria-label={`Editar ${c.nombre}`}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">No hay categorías</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar categoría</DialogTitle>

        {/* FORM REAL: el submit del botón sí ejecuta handleSubmit */}
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}

            <TextField
              label="Nombre"
              fullWidth
              margin="dense"
              value={editing.nombre ?? ""}
              onChange={e => setEditing(p => ({ ...p, nombre: e.target.value }))}
              inputProps={{ maxLength: 120 }}
            />

            <TextField
              select
              label="Tipo"
              fullWidth
              margin="dense"
              value={editing.typeId ?? ""}
              onChange={e => setEditing(p => ({ ...p, typeId: e.target.value }))}
            >
              {types.map(t => (
                <MenuItem key={t.id} value={t.id}>
                  {t.nombre}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !hasChanges}
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Paper>
  );
}
