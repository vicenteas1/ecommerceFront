import { useState } from "react";
import {
  Container, Typography, TextField, Grid, Button, Alert, CircularProgress, Box
} from "@mui/material";
import { sendContactMessage } from "../../services/contact/contact.service";

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const isEmailValid = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const canSubmit =
    nombre.trim().length >= 2 &&
    isEmailValid(email) &&
    asunto.trim().length >= 2 &&
    mensaje.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setOkMsg(null);
    setErrMsg(null);

    try {
      await sendContactMessage({ nombre, email, asunto, mensaje });
      setOkMsg("¡Gracias! Tu mensaje fue enviado correctamente.");
      setNombre("");
      setEmail("");
      setAsunto("");
      setMensaje("");
    } catch (err: any) {
      setErrMsg(err?.message || "Ocurrió un error al enviar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4, maxWidth: 800 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Contáctanos
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        ¿Tienes preguntas o necesitas ayuda? Envíanos un mensaje y te responderemos a la brevedad.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid  size={{xs: 12, sm: 6}}>
            <TextField
              label="Nombre"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              inputProps={{ maxLength: 120 }}
            />
          </Grid>

          <Grid  size={{xs: 12, sm: 6}}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!!email && !isEmailValid(email)}
              helperText={!!email && !isEmailValid(email) ? "Email inválido" : " "}
            />
          </Grid>

          <Grid size={{ xs: 12}}>
            <TextField
              label="Asunto"
              fullWidth
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              required
              inputProps={{ maxLength: 140 }}
            />
          </Grid>

          <Grid size={{ xs: 12}}>
            <TextField
              label="Mensaje"
              fullWidth
              multiline
              minRows={4}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              inputProps={{ maxLength: 2000 }}
              helperText={`${mensaje.length}/2000`}
            />
          </Grid>

          <Grid size={{ xs: 12}}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!canSubmit || loading}
              startIcon={loading ? <CircularProgress size={18} /> : null}
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </Grid>

          <Grid size={{ xs: 12}}>
            {okMsg && <Alert severity="success">{okMsg}</Alert>}
            {errMsg && <Alert severity="error">{errMsg}</Alert>}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
