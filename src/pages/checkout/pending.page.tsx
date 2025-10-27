import { Button, Container, Typography, Stack } from "@mui/material";
import HourglassBottom from "@mui/icons-material/HourglassBottom";
import { useNavigate } from "react-router-dom";

export default function CheckoutPendingPage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Stack spacing={3} alignItems="center">
        <HourglassBottom sx={{ fontSize: 96, color: "warning.main" }} />
        <Typography variant="h4" fontWeight={700}>
          Pago pendiente
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
          Tu pago aún está en proceso o pendiente de confirmación. Te notificaremos
          por correo electrónico una vez se confirme.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/home")}>
          Volver al inicio
        </Button>
      </Stack>
    </Container>
  );
}
