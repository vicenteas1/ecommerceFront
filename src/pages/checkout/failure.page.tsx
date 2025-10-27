import { Button, Container, Typography, Stack } from "@mui/material";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

export default function CheckoutFailurePage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Stack spacing={3} alignItems="center">
        <ErrorOutline sx={{ fontSize: 96, color: "error.main" }} />
        <Typography variant="h4" fontWeight={700}>
          Pago fallido
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
          No pudimos procesar tu pago. Puede deberse a un error en la tarjeta o a
          un problema con la conexión. Intenta nuevamente.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => navigate("/cart")}>
            Volver al carrito
          </Button>
          <Button variant="contained" color="error" onClick={() => navigate("/home")}>
            Ir al inicio
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
