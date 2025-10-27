import { Button, Container, Typography, Stack } from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Stack spacing={3} alignItems="center">
        <CheckCircleOutline sx={{ fontSize: 96, color: "success.main" }} />
        <Typography variant="h4" fontWeight={700}>
          ¡Pago exitoso!
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
          Tu transacción fue procesada correctamente. En breve recibirás un correo
          con los detalles del pago.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/home")}>
          Volver al inicio
        </Button>
      </Stack>
    </Container>
  );
}
