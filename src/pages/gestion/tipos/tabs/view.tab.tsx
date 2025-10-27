import { useEffect, useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert, Paper, LinearProgress } from "@mui/material";
import { getTypes } from "../../../../services/type/type.service";
import type { Type } from "../../../../models/services/type/types.model";

export default function ViewTypesTab() {
  const [items, setItems] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTypes();
        setItems(data);
      } catch (e: any) {
        setError(e?.message ?? "Error cargando tipos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.nombre}</TableCell>
              <TableCell>{t.slug}</TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={2} align="center">No hay tipos</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
