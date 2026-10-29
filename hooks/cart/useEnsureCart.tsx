import { supabase } from "@/lib/supabase";
import { useCallback, useRef, useState } from "react";

export type EnsureCartResult =
  | { success: true; cartId: string }
  | { success: false; error: string };

type State = {
  cartId: string | null;
  pending: boolean;
  error: string | null;
};

export function useEnsureCart() {
  const [state, setState] = useState<State>({
    cartId: null,
    pending: false,
    error: null,
  });

  const mounted = useRef(true);

  const ensureCart = useCallback(async (): Promise<EnsureCartResult> => {
    mounted.current = true;
    setState((s) => ({ ...s, pending: true, error: null }));

    try {
      // 1) resolve authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        const msg = "You must be signed in to use the cart";
        if (mounted.current) {
          setState({ cartId: null, pending: false, error: msg });
        }
        return { success: false, error: msg };
      }

      const guestId = user.id;

      // 2) find existing carts for this user, preferring one with items
      const { data: carts, error: selectError } = await supabase
        .from("carts")
        .select("id, cart_items(id)")
        .eq("guest_id", guestId)
        .order("id", { ascending: false });

      if (selectError) {
        console.error("Ensure cart select error:", selectError);
        const msg = "Failed to find cart";
        if (mounted.current) {
          setState({ cartId: null, pending: false, error: msg });
        }
        return { success: false, error: msg };
      }

      const withItems = (carts ?? []).find(
        (c: any) => Array.isArray(c.cart_items) && c.cart_items.length > 0,
      );
      const chosen = withItems ?? carts?.[0];

      if (chosen?.id) {
        const cartId = String(chosen.id);
        if (mounted.current) {
          setState({ cartId, pending: false, error: null });
        }
        return { success: true, cartId };
      }

      // 3) create new cart
      const { data: created, error: insertError } = await supabase
        .from("carts")
        .insert({ guest_id: guestId, total: 0 })
        .select("id")
        .single();

      if (insertError || !created) {
        console.error("Create cart error:", insertError);
        const msg = "Failed to create cart";
        if (mounted.current) {
          setState({ cartId: null, pending: false, error: msg });
        }
        return { success: false, error: msg };
      }

      const cartId = String(created.id);
      if (mounted.current) {
        setState({ cartId, pending: false, error: null });
      }
      return { success: true, cartId };
    } catch (e: any) {
      console.error("Cart ensure error:", e);
      const msg = e?.message ?? "Failed to ensure cart";
      if (mounted.current) {
        setState({ cartId: null, pending: false, error: msg });
      }
      return { success: false, error: msg };
    }
  }, []);

  const reset = useCallback(() => {
    mounted.current = false;
    setState({ cartId: null, pending: false, error: null });
  }, []);

  return { ...state, ensureCart, reset };
}
