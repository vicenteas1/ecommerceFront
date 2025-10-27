import { useEffect, useState } from "react";
import { listUsers } from "../../../../services/user/user.service";
import type { SafeUser } from "../../../../models/services/user/user.model";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, LinearProgress } from "@mui/material";

export default function ViewUsersTab() {
  const [rows, setRows] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setRows(await listUsers()); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Creado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>{u.fech_creacion ? new Date(u.fech_creacion).toLocaleString() : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
