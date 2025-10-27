import { useEffect, useMemo, useState } from "react";
import {
  Box, Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Alert, LinearProgress, Paper
} from "@mui/material";

import { getCategories } from "../../../../services/categories/categories.service";
import { getTypes } from "../../../../services/type/type.service";
import { getItems, type Item } from "../../../../services/item/item.service";
import type { TypeItem } from "../../../../models/services/item/item.model";
import type { CategoryItem, CategoryLite } from "../../../../models/services/categories/categories.model";

export default function ViewItemsTab() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [types, setTypes] = useState<TypeItem[]>([]);
  const [categories, setCategories] = useState<CategoryLite[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);

  const typeNameById = useMemo(() => {
    const m = new Map<string, string>();
    types.forEach(t => m.set(t._id, t.nombre));
    return m;
  }, [types]);

  const categoryNameById = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach(c => m.set(c._id, c.nombre));
    return m;
  }, [categories]);

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
        setCategories((cats ?? []).map((c: any) => ({
          _id: c._id ?? c.id,
          nombre: c.nombre,
          slug: c.slug,
        })));
      } catch (err) {
        console.error("Error cargando meta:", err);
      } finally {
        setMetaLoading(false);
      }
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
            <TableCell>Descripción</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Categoría</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(it => (
            <TableRow key={it.id}>
              <TableCell>{it.nombre}</TableCell>
              <TableCell>{it.descripcion}</TableCell>
              <TableCell>${it.precio.toLocaleString("es-CL")}</TableCell>
              <TableCell>
                {typeNameById.get(typeof (it as any).type === "string" ? (it as any).type : (it as any)?.type?._id ?? "")
                ?? (typeof (it as any).type === "string" ? (it as any).type : (it as any)?.type?.nombre ?? "")}
              </TableCell>

              <TableCell>
                {categoryNameById.get(typeof (it as any).category === "string" ? (it as any).category : (it as any)?.category?._id ?? "")
                ?? (typeof (it as any).category === "string" ? (it as any).category : (it as any)?.category?.nombre ?? "")}
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={5} align="center">No hay ítems</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
