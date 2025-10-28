import React, { useMemo, useState } from "react";
import { Wallet } from "@mercadopago/sdk-react";
import {
  Box, Button, Container, Divider, Grid, IconButton, Stack, TextField, Typography
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ShoppingCartCheckout from "@mui/icons-material/ShoppingCartCheckout";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import {
  selectCartItems, selectCartTotal,
  updateQty, removeItem, clearCart
} from "../../store/cart.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createMpPreference } from "../../services/payment/payment.service";

const CLP = (n: number) => `$${n.toLocaleString("es-CL")}`;

export default function CarritoPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  const isEmpty = items.length === 0;
  const subtotal = total;

  const summary = useMemo(() => ({
    subtotal,
    envio: 0,
    impuestos: 0,
    total: subtotal,
  }), [subtotal]);

  // Genera la preferencia y habilita el botón Wallet
  const handleCreatePreference = async () => {
    if (isEmpty || summary.total <= 0) return;
    try {
      setLoading(true);
      const payload = items.map((it) => ({
        title: it.nombre,
        quantity: it.qty,
        unit_price: it.precio,
      }));

      // tu backend debe devolver { id, init_point, payment }
      const pref = await createMpPreference(payload);

      if (!pref?.id) {
        alert("No se pudo generar la preferencia de pago.");
        return;
      }

      setPreferenceId(pref.id); // <- clave para Wallet
      // Si quisieras redirigir clásico:
      // if (pref.init_point) window.location.href = pref.init_point;
    } catch (e: any) {
      alert(e?.message || "No se pudo iniciar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>Carrito</Typography>
        {!isEmpty && (
          <Button color="error" onClick={() => dispatch(clearCart())}>
            Vaciar carrito
          </Button>
        )}
      </Stack>

      {isEmpty ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Tu carrito está vacío
          </Typography>
          <Button variant="contained" onClick={() => navigate("/servicios")}>
            Ver servicios
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{xs:12, md:6}}>
            <Stack spacing={2}>
              {items.map((it) => (
                <Box
                  key={it.id}
                  sx={{
                    p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider",
                    display: "flex", alignItems: "center", gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 72, height: 72, borderRadius: 2, bgcolor: "action.hover",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden"
                    }}
                  >
                    <img
                      src="/assets/construccion-icon.png"
                      alt={it.nombre}
                      style={{ width: 48, height: 48, objectFit: "contain", opacity: 0.9 }}
                    />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={700} noWrap title={it.nombre}>
                      {it.nombre}
                    </Typography>
                    <Typography color="text.secondary">{CLP(it.precio)}</Typography>
                  </Box>

                  <TextField
                    label="Cant."
                    type="number"
                    size="small"
                    value={it.qty}
                    inputProps={{ min: 1 }}
                    onChange={(e) => {
                      const q = Math.max(1, Number(e.target.value) || 1);
                      dispatch(updateQty({ id: it.id, qty: q }));
                    }}
                    sx={{ width: 96 }}
                  />

                  <Box sx={{ width: 120, textAlign: "right" }}>
                    <Typography fontWeight={700}>{CLP(it.precio * it.qty)}</Typography>
                  </Box>

                  <IconButton
                    color="error"
                    aria-label={`Eliminar ${it.nombre}`}
                    onClick={() => dispatch(removeItem({ id: it.id }))}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            <Button startIcon={<ArrowBack />} sx={{ mt: 2 }} onClick={() => navigate(-1)}>
              Seguir comprando
            </Button>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Box
              sx={{
                p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider",
                position: "sticky", top: 24,
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Resumen
              </Typography>

              <Stack spacing={1} sx={{ mb: 2 }}>
                <Row label="Subtotal" value={CLP(summary.subtotal)} />
                <Row label="Envío" value={CLP(0)} />
                <Row label="Impuestos" value={CLP(0)} />
                <Divider />
                <Row label="Total" value={CLP(summary.total)} strong />
              </Stack>

              {/* Si aún no creamos la preferencia, mostramos el botón para generarla */}
              {!preferenceId ? (
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  startIcon={<ShoppingCartCheckout />}
                  onClick={handleCreatePreference}
                  disabled={loading || isEmpty || summary.total <= 0}
                >
                  {loading ? "Creando preferencia…" : "Pagar con Mercado Pago"}
                </Button>
              ) : (
                // Cuando tenemos preferenceId, renderizamos Wallet
                <div style={{ width: 320, margin: "0 auto" }}>
                  <Wallet
                    initialization={{ preferenceId }}
                    // Opcional: personalizaciones
                    // customization={{ texts: { valueProp: 'smart_option' } }}
                  />
                </div>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={strong ? 800 : 600}>{value}</Typography>
    </Stack>
  );
}
