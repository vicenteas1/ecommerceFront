import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import ViewUsersTab from "./tabs/view.tab";
import EditUsersTab from "./tabs/edit.tab";
import DeleteUsersTab from "./tabs/delete.tab";
import CreateUsersTab from "./tabs/create.tab";

export default function UsersManagementPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Crear" />
        <Tab label="Ver" />
        <Tab label="Editar" />
        <Tab label="Eliminar" />
      </Tabs>

      {tab === 0 && <CreateUsersTab />}
      {tab === 1 && <ViewUsersTab />}
      {tab === 2 && <EditUsersTab />}
      {tab === 3 && <DeleteUsersTab />}
    </Box>
  );
}
