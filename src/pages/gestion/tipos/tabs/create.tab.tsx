import { useState } from "react";
import { Box, TextField, Button, Alert, Paper, LinearProgress } from "@mui/material";
import { createType } from "../../../../services/type/type.service";

export default function CreateTypeTab() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    if (!nombre.trim()) {
      setError("Ingresa un nombre.");
      return;
    }
    setLoading(true);

    try {
      const res = await createType({ nombre: nombre.trim() });
      setMensaje(`Tipo "${res.nombre}" creado con éxito`);
      setNombre("");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo crear el tipo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nombre del tipo"
          fullWidth
          required
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Creando..." : "Crear Tipo"}
        </Button>
      </Box>
    </Paper>
  );
}
