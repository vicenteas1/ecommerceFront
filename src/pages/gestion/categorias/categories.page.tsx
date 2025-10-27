import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import CreateCategoryTab from "./tabs/create.tab";
import EditCategoryTab from "./tabs/edit.tab";
import DeleteCategoryTab from "./tabs/delete.tab";
import ViewCategoriesTab from "./tabs/view.tab";

export default function GestionCategoriasPage() {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Tabs value={tab} onChange={(_, next) => setTab(next)} sx={{ mb: 2 }}>
        <Tab label="Crear" />
        <Tab label="Editar" />
        <Tab label="Eliminar" />
        <Tab label="Ver" />
      </Tabs>

      {tab === 0 && <CreateCategoryTab />}
      {tab === 1 && <EditCategoryTab />}
      {tab === 2 && <DeleteCategoryTab />}
      {tab === 3 && <ViewCategoriesTab />}
    </Box>
  );
}
