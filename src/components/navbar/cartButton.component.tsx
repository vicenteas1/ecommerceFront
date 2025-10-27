import { Badge, IconButton, Tooltip } from "@mui/material";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectCartCount } from "../../store/cart.slice";

export default function CartButton() {
  const navigate = useNavigate();
  const count = useAppSelector(selectCartCount);

  return (
    <Tooltip title="Ver carrito">
      <IconButton color="inherit" onClick={() => navigate("/cart")} aria-label="Carrito">
        <Badge badgeContent={count} color="error" max={99} overlap="circular">
          <ShoppingCartOutlined />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
