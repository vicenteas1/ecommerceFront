export function logout(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("token");

  window.location.href = "/home";
}
