import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import CreateTypeTab from "./tabs/create.tab";
import EditTypeTab from "./tabs/edit.tab";
import DeleteTypeTab from "./tabs/delete.tab";
import ViewTypesTab from "./tabs/view.tab";

export default function GestionTiposPage() {
  const [tab, setTab] = useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => setTab(newValue);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Crear" />
        <Tab label="Editar" />
        <Tab label="Eliminar" />
        <Tab label="Ver" />
      </Tabs>

      {tab === 0 && <CreateTypeTab />}
      {tab === 1 && <EditTypeTab />}
      {tab === 2 && <DeleteTypeTab />}
      {tab === 3 && <ViewTypesTab />}
    </Box>
  );
}
