import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Grid,
  Link as MUILink,
  Skeleton,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import { getItemById, type Item } from "../../services/item/item.service";

import { addItem } from "../../store/cart.slice";
import { useAppDispatch } from "../../store/hooks";

const CLP = (n?: number) =>
  typeof n === "number" ? `$${n.toLocaleString("es-CL")}` : "";

export default function ServiciosDetallePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const resp = await getItemById(id);
        if (mounted) setItem(resp);
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? "No se pudo cargar el ítem.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const titulo = item?.nombre ?? "Detalle del servicio";
  const categoriaNombre = useMemo(() => {
    if (!item?.category) return "";
    return typeof item.category === "string" ? item.category : (item.category.nombre ?? "");
  }, [item]);
  const tipoNombre = useMemo(() => {
    if (!item?.type) return "";
    return typeof item.type === "string" ? item.type : (item.type.nombre ?? "");
  }, [item]);

  const handleVolver = () => navigate(-1);

  const handleAddToCart = () => {
    if (!item) return;
    dispatch(
      addItem({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        qty: 1,
      })
    );
  };

  return (
    <Container sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MUILink underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Inicio
        </MUILink>
          {tipoNombre == 'servicios' && 
            <MUILink underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => navigate("/servicios")}>
            Servicios
            </MUILink>
          }
          {tipoNombre == 'categoria' && 
            <MUILink underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => navigate("/categorias")}>
            Categoria
            </MUILink>
          }
        {tipoNombre && <Typography color="text.primary" component="span">{tipoNombre}</Typography>}
        {categoriaNombre && <Typography color="text.primary" component="span">{categoriaNombre}</Typography>}
      </Breadcrumbs>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        {loading ? <Skeleton width={320} /> : titulo}
      </Typography>

      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{xs: 12, md: 6}}>
          {loading ? (
            <Skeleton variant="rounded" height={360} />
          ) : (
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                height: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "action.hover",
              }}
            >
              <img
                src="../../assets/construccion-icon.png"
                alt={item?.nombre}
                style={{ width: 160, height: 160, objectFit: "contain", opacity: 0.9 }}
              />
            </Box>
          )}
        </Grid>

        <Grid size={{xs: 12, md: 6}}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {tipoNombre && <Chip label={tipoNombre} size="small" />}
              {categoriaNombre && <Chip label={categoriaNombre} size="small" />}
            </Stack>

            <Typography variant="h5" fontWeight={700}>
              {loading ? <Skeleton width={140} /> : CLP(item?.precio)}
            </Typography>

            <Typography color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
              {loading ? (
                <>
                  <Skeleton /><Skeleton width="92%" /><Skeleton width="84%" />
                </>
              ) : (item?.descripcion || "Sin descripción.")}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAddToCart}
                disabled={loading || !item}
              >
                Agregar al carrito
              </Button>

              <Button variant="outlined" onClick={handleVolver}>Volver</Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
