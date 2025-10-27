import { useEffect, useMemo, useState } from "react";
import {
  Box, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress, Alert, MenuItem, Paper, LinearProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getItems, updateItem, type Item } from "../../../../services/item/item.service";
import { getCategories, getTypes } from "../../../../services/categories/categories.service";

type TypeItem = { _id: string; nombre: string; slug: string };
type CategoryItem = { _id: string; nombre: string; slug: string; type: { _id: string } | string };

export default function EditItemTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Item> & { id?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [types, setTypes] = useState<TypeItem[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);

  const typeNameById = useMemo(() => {
    const m = new Map<string, string>();
    types.forEach(t => m.set(t._id, t.nombre));
    return m;
  }, [types]);

  const categoryNameById = useMemo(() => {
    const m = new Map<string, string>();
    allCategories.forEach(c => m.set(c._id, c.nombre));
    return m;
  }, [allCategories]);

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

  useEffect(() => {
    (async () => {
      try {
        const [tps, cats] = await Promise.all([getTypes(), getCategories()]);
        setTypes((tps ?? []).map((t: any) => ({ _id: t._id ?? t.id, nombre: t.nombre, slug: t.slug })));
        setAllCategories((cats ?? []).map((c: any) => ({
          _id: c._id ?? c.id, nombre: c.nombre, slug: c.slug, type: c.type,
        })));
      } catch (err) {
        console.error("Error cargando meta:", err);
      } finally {
        setMetaLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const typeId = editing.type as string | undefined;
      if (!open || !typeId) { setCategories([]); return; }
      setCatsLoading(true);
      try {
        const cats: any[] = await getCategories({ typeId });
        setCategories((cats ?? []).map(c => ({
          _id: c._id ?? c.id, nombre: c.nombre, slug: c.slug, type: c.type,
        })));
      } catch (err) {
        console.error("Error cargando categorías (modal):", err);
      } finally {
        setCatsLoading(false);
      }
    })();
  }, [open, editing.type]);

  const handleOpen = async (it: Item) => {
    setSaveError(null);
    setEditing({
      id: it.id, nombre: it.nombre, descripcion: it.descripcion,
      precio: it.precio, type: it.type, category: it.category,
    });
    try {
      setCatsLoading(true);
      const cats: any[] = await getCategories({ typeId: it.type });
      setCategories((cats ?? []).map(c => ({
        _id: c._id ?? c.id, nombre: c.nombre, slug: c.slug, type: c.type,
      })));
    } catch (err) {
      console.error("Error pre-cargando categorías:", err);
    } finally {
      setCatsLoading(false);
      setOpen(true);
    }
  };

  const handleSave = async () => {
    if (!editing.id) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateItem(editing.id, {
        nombre: editing.nombre,
        descripcion: editing.descripcion,
        precio: editing.precio !== undefined ? Number(editing.precio) : undefined,
        type: editing.type as string | undefined,
        category: editing.category as string | undefined,
      });
      setOpen(false);
      await load();
    } catch (err: any) {
      setSaveError(err?.response?.data?.message ?? "No se pudo actualizar el ítem");
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
            <TableCell>Descripción</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((it) => (
            <TableRow key={it.id}>
              <TableCell>{it.nombre}</TableCell>
              <TableCell style={{ maxWidth: 900 }}>{it.descripcion}</TableCell>
              <TableCell>${it.precio.toLocaleString("es-CL")}</TableCell>
              <TableCell>{typeNameById.get(it.type) ?? it.type}</TableCell>
              <TableCell>{categoryNameById.get(it.category) ?? it.category}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => handleOpen(it)} aria-label={`Editar ${it.nombre}`}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={6} align="center">No hay ítems</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar ítem</DialogTitle>
        <DialogContent>
          {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}

          <TextField
            label="Nombre" fullWidth margin="dense"
            value={editing.nombre ?? ""} onChange={e => setEditing(p => ({ ...p, nombre: e.target.value }))}
          />
          <TextField
            label="Descripción" fullWidth margin="dense" multiline rows={3}
            value={editing.descripcion ?? ""} onChange={e => setEditing(p => ({ ...p, descripcion: e.target.value }))}
          />
          <TextField
            label="Precio" type="number" fullWidth margin="dense"
            value={editing.precio ?? ""} onChange={e => setEditing(p => ({ ...p, precio: Number(e.target.value) }))}
          />

          <TextField
            select label="Tipo" fullWidth margin="dense"
            value={(editing.type as string) ?? ""}
            onChange={(e) => {
              const nextTypeId = (e.target as HTMLInputElement).value;
              setEditing(prev => ({ ...prev, type: nextTypeId, category: "" }));
            }}
            SelectProps={{ renderValue: v => typeNameById.get(v as string) ?? "" }}
          >
            {types.map(t => <MenuItem key={t._id} value={t._id}>{t.nombre}</MenuItem>)}
          </TextField>

          <TextField
            select label="Categoría" fullWidth margin="dense"
            value={(editing.category as string) ?? ""}
            onChange={(e) => setEditing(prev => ({ ...prev, category: (e.target as HTMLInputElement).value }))}
            disabled={!editing.type || catsLoading}
            SelectProps={{
              renderValue: (v) => {
                const nameFromModal = categories.find(c => c._id === v)?.nombre;
                if (nameFromModal) return nameFromModal;
                return categoryNameById.get(v as string) ?? (v ? String(v) : "");
              },
            }}
          >
            {catsLoading ? (
              <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Cargando categorías...</MenuItem>
            ) : categories.length === 0 ? (
              <MenuItem disabled>{editing.type ? "Sin categorías para este tipo" : "Selecciona un tipo"}</MenuItem>
            ) : (
              categories.map(c => <MenuItem key={c._id} value={c._id}>{c.nombre}</MenuItem>)
            )}
          </TextField>
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
