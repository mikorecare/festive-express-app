import { useCartItems } from "@/hooks/cart/useCartItems";
import { useEnsureCart } from "@/hooks/cart/useEnsureCart";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

type Ctx = {
  cartId: string | null;
  count: number;
  items: any[];
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  ensure: () => Promise<string | null>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<Ctx>({
  cartId: null,
  count: 0,
  items: [],
  ready: false,
  isOpen: false,
  open: () => {},
  close: () => {},
  ensure: async () => null,
  refresh: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { ensureCart } = useEnsureCart();
  const [cartId, setCartId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inflight = useRef<Promise<string | null> | null>(null);

  const { data: cartData, refetch } = useCartItems(cartId);
  const count = cartData?.count ?? 0;
  const items = cartData?.items ?? [];

  const ensure = useCallback(async () => {
    if (cartId) return cartId;
    if (inflight.current) return inflight.current;

    inflight.current = (async () => {
      const res = await ensureCart();
      const id = res.success ? res.cartId : null;
      setCartId(id);
      setReady(true);
      return id;
    })();

    const id = await inflight.current;
    inflight.current = null;
    return id;
  }, [cartId, ensureCart]);

  useEffect(() => {
    ensure();
  }, [ensure]);

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cartId,
        count,
        items,
        ready,
        isOpen,
        open,
        close,
        ensure,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
