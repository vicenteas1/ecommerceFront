import { useState, useEffect } from "react";
import {
  Box, TextField, Button, Alert, MenuItem, CircularProgress,
  Paper, LinearProgress
} from "@mui/material";
import { getCategories } from "../../../../services/categories/categories.service";
import { getTypes } from "../../../../services/type/type.service";
import { createItem } from "../../../../services/item/item.service";
import type { TypeItem } from "../../../../models/services/item/item.model";
import type { CategoryItem } from "../../../../models/services/categories/categories.model";

export default function CreateItemTab() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  const [typeId, setTypeId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [types, setTypes] = useState<TypeItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [catsLoading, setCatsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const tps: any[] = await getTypes();
        setTypes((tps ?? []).map(t => ({ _id: t._id ?? t.id, nombre: t.nombre, slug: t.slug })));
      } catch {
        setError("No se pudieron cargar los tipos.");
      } finally {
        setMetaLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!typeId) {
        setCategories([]);
        setCategoryId("");
        return;
      }
      setCatsLoading(true);
      setError(null);
      try {
        const cats: any[] = await getCategories({ typeId });
        const mapped = (cats ?? []).map(c => ({
          _id: c._id ?? c.id,
          nombre: c.nombre,
          slug: c.slug,
          type: c.type,
        }));
        setCategories(mapped);
        if (mapped.every(c => c._id !== categoryId)) setCategoryId("");
      } catch {
        setError("No se pudieron cargar las categorías para el tipo seleccionado.");
      } finally {
        setCatsLoading(false);
      }
    })();
  }, [typeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!nombre.trim() || !descripcion.trim()) return setError("Completa nombre y descripción.");
    if (!typeId || !categoryId) return setError("Selecciona tipo y categoría.");

    const precioNumber = Number(precio);
    if (!Number.isFinite(precioNumber) || precioNumber < 0) return setError("El precio no es válido.");

    setLoading(true);
    try {
      const item = await createItem({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNumber,
        type: typeId,
        category: categoryId,
      });
      setMensaje(`Ítem "${item.nombre}" creado con éxito`);
      setNombre(""); setDescripcion(""); setPrecio("");
      setTypeId(""); setCategoryId(""); setCategories([]);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "No se pudo crear el ítem.");
    } finally {
      setLoading(false);
    }
  };

  if (metaLoading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Nombre" fullWidth required margin="normal"
          value={nombre} onChange={e => setNombre(e.target.value)}
        />
        <TextField
          label="Descripción" fullWidth required margin="normal" multiline rows={3}
          value={descripcion} onChange={e => setDescripcion(e.target.value)}
        />
        <TextField
          label="Precio" type="number" required fullWidth margin="normal"
          value={precio} onChange={e => setPrecio(e.target.value)}
          inputProps={{ step: "0.01", min: "0" }}
        />

        <TextField
          select label="Tipo" required fullWidth margin="normal"
          value={typeId} onChange={e => setTypeId((e.target as HTMLInputElement).value)}
        >
          {types.map(t => <MenuItem key={t._id} value={t._id}>{t.nombre}</MenuItem>)}
        </TextField>

        <TextField
          select label="Categoría" required fullWidth margin="normal"
          value={categoryId} onChange={e => setCategoryId((e.target as HTMLInputElement).value)}
          disabled={!typeId || catsLoading}
        >
          {catsLoading ? (
            <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Cargando categorías...</MenuItem>
          ) : categories.length === 0 ? (
            <MenuItem disabled>{typeId ? "Sin categorías para este tipo" : "Selecciona un tipo primero"}</MenuItem>
          ) : (
            categories.map(c => <MenuItem key={c._id} value={c._id}>{c.nombre}</MenuItem>)
          )}
        </TextField>

        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? "Creando..." : "Crear Ítem"}
        </Button>
      </Box>
    </Paper>
  );
}
