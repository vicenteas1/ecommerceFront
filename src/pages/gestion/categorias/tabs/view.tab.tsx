import { useEffect, useMemo, useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Alert, Chip, Box, LinearProgress
} from "@mui/material";
import type { Category } from "../../../../models/services/categories/categories.model";
import type { Type } from "../../../../models/services/type/types.model";
import { getCategories } from "../../../../services/categories/categories.service";
import { getTypes } from "../../../../services/type/type.service";

export default function ViewCategoriesTab() {
  const [items, setItems] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const typeNameById = useMemo(() => {
    const m = new Map<string, string>();
    types.forEach(t => m.set(t.id, t.nombre));
    return m;
  }, [types]);

  useEffect(() => {
    (async () => {
      try { setItems(await getCategories()); }
      catch (e: any) { setError(e?.message ?? "Error cargando categorías"); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try { setTypes(await getTypes()); }
      finally { setMetaLoading(false); }
    })();
  }, []);

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
              </TableRow>
            );
          })}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={2} align="center">No hay categorías</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
