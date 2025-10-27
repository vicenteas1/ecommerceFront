import { useMemo, useState } from "react";
import {
  Box, TextField, Button, Alert, Grid, Divider, Typography,
  InputAdornment, IconButton
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { changeMyPassword, updateUser } from "../../services/user/user.service";

// ⚠️ Reemplaza esto por tu hook/contexto real
function useAuth() {
  // Debe devolver al menos: { user: { id: string, email: string } }
  return { user: { id: "CURRENT_USER_ID", email: "" } };
}

export default function ProfilePage() {
  const { user } = useAuth();

  // ---------------- Correo ----------------
  const [email, setEmail] = useState(user?.email ?? "");
  const [email2, setEmail2] = useState(user?.email ?? "");
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()),
    [email]
  );
  const canSaveEmail = useMemo(
    () => !!user?.id && isEmailValid && email.trim() === email2.trim() && email.trim().length > 3,
    [user?.id, isEmailValid, email, email2]
  );

  async function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!canSaveEmail || !user?.id) return;
    setEmailMsg(null); setSavingEmail(true);
    try {
      await updateUser(user.id, { email: email.trim() });
      setEmailMsg({ type: "success", text: "Correo actualizado correctamente." });
    } catch (err: any) {
      setEmailMsg({ type: "error", text: err?.message ?? "No se pudo actualizar el correo." });
    } finally {
      setSavingEmail(false);
    }
  }

  // ---------------- Contraseña ----------------
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loadingPwd, setLoadingPwd] = useState(false);

  const canChangePwd = useMemo(
    () => oldPassword.trim().length >= 1 && newPassword.trim().length >= 8,
    [oldPassword, newPassword]
  );

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdMsg(null); setLoadingPwd(true);
    try {
      await changeMyPassword({ oldPassword, newPassword });
      setPwdMsg({ type: "success", text: "Contraseña actualizada." });
      setOldPassword(""); setNewPassword("");
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err?.message ?? "No se pudo actualizar la contraseña." });
    } finally {
      setLoadingPwd(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Mi Perfil
      </Typography>

      {/* ====== Correo ====== */}
      <Box component="form" onSubmit={handleSaveEmail} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Actualizar correo</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Este correo será usado para tu inicio de sesión y notificaciones.
        </Alert>
        {emailMsg && <Alert severity={emailMsg.type} sx={{ mb: 2 }}>{emailMsg.text}</Alert>}

        <Grid container spacing={2}>
          <Grid size={{xs: 12}}>
            <TextField
              label="Nuevo correo"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!email && !isEmailValid}
              helperText={!!email && !isEmailValid ? "Email inválido" : " "}
              inputProps={{ maxLength: 120 }}
              required
            />
          </Grid>
          <Grid size={{xs: 12}}>
            <TextField
              label="Confirmar nuevo correo"
              type="email"
              fullWidth
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              error={!!email2 && email2.trim() !== email.trim()}
              helperText={!!email2 && email2.trim() !== email.trim() ? "Los correos no coinciden" : " "}
              inputProps={{ maxLength: 120 }}
              required
            />
          </Grid>
          <Grid size={{xs: 12}}>
            <Button type="submit" variant="contained" disabled={!canSaveEmail || savingEmail}>
              {savingEmail ? "Guardando..." : "Guardar correo"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ====== Contraseña ====== */}
      <Box component="form" onSubmit={handleChangePassword} noValidate>
        <Typography variant="h6" sx={{ mb: 1 }}>Actualizar contraseña</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Esta acción cambia <strong>tu propia</strong> contraseña.
        </Alert>
        {pwdMsg && <Alert severity={pwdMsg.type} sx={{ mb: 2 }}>{pwdMsg.text}</Alert>}

        <Grid container spacing={2}>
          <Grid size={{xs: 12}}>
            <TextField
              label="Contraseña actual"
              type={showOld ? "text" : "password"}
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowOld(v => !v)} edge="end" aria-label="mostrar contraseña">
                      {showOld ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>

          <Grid size={{xs: 12}}>
            <TextField
              label="Nueva contraseña"
              type={showNew ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Mínimo 8 caracteres"
              inputProps={{ minLength: 8, maxLength: 128 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew(v => !v)} edge="end" aria-label="mostrar contraseña">
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>

          <Grid size={{xs: 12}}>
            <Button type="submit" variant="contained" disabled={!canChangePwd || loadingPwd}>
              {loadingPwd ? "Guardando..." : "Cambiar contraseña"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
