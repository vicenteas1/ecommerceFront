import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  Grid,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { login } from "../../services/login/login.service";
import type { ILogin, LoginResult } from "../../models/services/login/login.model";
import type { ApiResponse } from "../../models/apiResponse/apiResponse.model";
import background from "../../assets/loginban1.jpeg";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const payload: ILogin = { email, password };
      const response: ApiResponse<LoginResult | null> = await login(payload);

      if (response.code === 200 && response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("role", response.data.user.role);
        navigate("/home");
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
      <Grid size={{ xs: 12, md: 6}}
        sx={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Grid size={{ xs: 12, md: 6}}
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
            maxWidth: 400,
            p: 6,
            boxShadow: "none",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" color="primary" fontWeight={700} mb={3}>
              Bienvenido
            </Typography>

            <TextField
              label="Correo"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                {errorMessage}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Ingresar"}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2, py: 1.2 }}
              href="/register"
            >
              Registrarse
            </Button>

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2, py: 1.2 }}
              href="/home"
            >
              Home
            </Button>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
              ¿Olvidaste tu contraseña?
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
