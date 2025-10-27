import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { create } from "../../services/register/register.service";

import background from "../../assets/loginban1.jpeg";
import type { ApiResponse } from "../../models/apiResponse/apiResponse.model";
import type { INewUser } from "../../models/services/register/register.model";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const usernameValid = useMemo(() => username.trim().length >= 3, [username]);
  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const pwdValid = password.length >= 8;
  const confirmValid = confirm === password && confirm.length > 0;

  const formValid = usernameValid && emailValid && pwdValid && confirmValid;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      setErrorMessage("");
      setSuccessMsg("");

      if (!formValid) {
        setErrorMessage("Revisa los campos del formulario.");
        return;
      }

      const payload: INewUser = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: "buyer"
      }
      const response: ApiResponse<any | null> = await create(payload);

      if (response.code === 201) {
        navigate("/login"); 
      } else {
        setErrorMessage(response.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: 6,
            boxShadow: "none",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" color="primary" fontWeight={700} mb={3}>
              Crear cuenta
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            {successMsg && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMsg}
              </Alert>
            )}

            <TextField
              label="Nombre de usuario"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!username && !usernameValid}
              helperText={!!username && !usernameValid ? "Mínimo 3 caracteres." : " "}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Correo"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!email && !emailValid}
              helperText={!!email && !emailValid ? "Correo inválido." : " "}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Contraseña"
              type={showPwd ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!password && !pwdValid}
              helperText={!!password && !pwdValid ? "Mínimo 8 caracteres." : " "}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="mostrar contraseña"
                      onClick={() => setShowPwd((s) => !s)}
                      edge="end"
                    >
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirmar contraseña"
              type={showConfirm ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={!!confirm && !confirmValid}
              helperText={!!confirm && !confirmValid ? "Las contraseñas no coinciden." : " "}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="mostrar confirmación"
                      onClick={() => setShowConfirm((s) => !s)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2, py: 1.2 }}
              disabled={loading || !formValid}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Registrarme"}
            </Button>

            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              fullWidth
              sx={{ mt: 1.5 }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
