import { useEffect, useState } from "react";
import {
  Paper, TextField, Button, Alert, MenuItem,
  CircularProgress, LinearProgress, Box
} from "@mui/material";
import type { Type } from "../../../../models/services/type/types.model";
import { createCategory } from "../../../../services/categories/categories.service";
import { getTypes } from "../../../../services/type/type.service";

export default function CreateCategoryTab() {
  const [nombre, setNombre] = useState("");
  const [typeId, setTypeId] = useState("");
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try { setTypes(await getTypes()); }
      catch { setError("No se pudieron cargar los tipos"); }
      finally { setMetaLoading(false); }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null); setError(null);
    if (!nombre.trim()) return setError("El nombre es obligatorio.");
    if (!typeId) return setError("Selecciona un tipo.");

    setLoading(true);
    try {
      const created = await createCategory({ nombre: nombre.trim(), typeId });
      setOk(`Categoría "${created.nombre}" creada`);
      setNombre(""); setTypeId("");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  if (metaLoading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={onSubmit}>
        <TextField
          label="Nombre" value={nombre}
          onChange={e => setNombre(e.target.value)}
          fullWidth required margin="normal"
        />
        <TextField
          select label="Tipo" value={typeId}
          onChange={e => setTypeId(e.target.value)}
          fullWidth required margin="normal"
        >
          {types.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? "Creando..." : "Crear categoría"}
        </Button>
      </Box>
    </Paper>
  );
}
