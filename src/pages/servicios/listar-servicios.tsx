import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Breadcrumbs, Link, Typography, Grid } from "@mui/material";

import { getTypes } from "../../services/type/type.service";
import { getCategories } from "../../services/categories/categories.service";
import { getItemsFiltered, type Item } from "../../services/item/item.service";
import ServiceItemCard from "../../components/card/card.component";

type TypeRow = { _id: string; nombre: string; slug: string };
type CategoryRow = { _id: string; nombre: string; slug: string; type: string };

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ServiciosListadoPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const tipoSlug = (query.get("tipo") || "").toLowerCase();
  const catSlug  = (query.get("categoria") || "").toLowerCase();

  const [title, setTitle] = useState<string>("Servicios");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [typeName, setTypeName] = useState<string>("");
  const [catName, setCatName] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const typesRaw: any[] = await getTypes();
        const types: TypeRow[] = (typesRaw ?? []).map((t: any) => ({
          _id: t._id ?? t.id,
          nombre: t.nombre,
          slug: String(t.slug || t.nombre).toLowerCase(),
        }));
        const typeRow = types.find(t => t.slug === tipoSlug);

        const catsRaw: any[] = await getCategories();
        const cats: CategoryRow[] = (catsRaw ?? []).map((c: any) => ({
          _id: c._id ?? c.id,
          nombre: c.nombre,
          slug: String(c.slug || c.nombre).toLowerCase(),
          type: typeof c.type === "string" ? c.type : (c.type?._id ?? c.type?.id),
        }));
        const catRow = cats.find(c => c.slug === catSlug && (!typeRow || c.type === typeRow._id));

        const typeId = typeRow?._id;
        const catId  = catRow?._id;

        setTypeName(typeRow?.nombre ?? "");
        setCatName(catRow?.nombre ?? "");

        const resp = await getItemsFiltered({
          type: typeId,
          category: catId,
          page: 1,
          limit: 24,
        });
        setItems(resp?.items ?? []);

        const niceTitle = [catRow?.nombre || "", typeRow?.nombre ? `(${typeRow.nombre})` : ""]
          .filter(Boolean)
          .join(" ");
        setTitle(niceTitle || "Servicios");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [tipoSlug, catSlug]);

  const handleView = (it: Item) => {
    navigate(`/servicios/detalle/${it.id}`);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          Inicio
        </Link>
        {typeName && <Typography color="text.primary" component="span">{typeName}</Typography>}
        {catName && <Typography color="text.primary" component="span">{catName}</Typography>}
      </Breadcrumbs>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        {title}
      </Typography>

      {loading ? (
        <Typography color="text.secondary">Cargando…</Typography>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No hay ítems disponibles para esta categoría.</Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((it) => (
            <Grid key={it.id} size={{xs:12, sm:6, md:4, lg:3}}>
              <ServiceItemCard item={it} onView={handleView} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
