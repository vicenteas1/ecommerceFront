import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import CreateItemTab from "./tabs/create.tab";
import EditItemTab from "./tabs/edit.tab";
import DeleteItemTab from "./tabs/delete.tab";
import ViewItemsTab from "./tabs/view.tab";

export default function GestionItemsPage() {
  const [tab, setTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Crear" />
        <Tab label="Editar" />
        <Tab label="Eliminar" />
        <Tab label="Ver" />
      </Tabs>

      {tab === 0 && <CreateItemTab />}
      {tab === 1 && <EditItemTab />}
      {tab === 2 && <DeleteItemTab />}
      {tab === 3 && <ViewItemsTab />}
    </Box>
  );
}
