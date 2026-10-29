import { useCart } from "@/providers/CartProvider";
import { CartSheet } from "./CartSheet";

export function CartOverlay() {
  const { isOpen, close } = useCart();
  return <CartSheet visible={isOpen} onClose={close} />;
}
