import { supabase } from "@/lib/supabase";
import { useCallback, useRef, useState } from "react";

export type MutationResult = { success: boolean; error?: string };

type State = { pending: boolean; error: string | null };

export function useCartMutations() {
  const [state, setState] = useState<State>({ pending: false, error: null });
  const mounted = useRef(true);

  const wrap = useCallback(
    async (fn: () => Promise<MutationResult>): Promise<MutationResult> => {
      mounted.current = true;
      setState({ pending: true, error: null });
      try {
        const result = await fn();
        if (mounted.current) {
          setState({
            pending: false,
            error: result.success ? null : (result.error ?? null),
          });
        }
        return result;
      } catch (e: any) {
        const err = e?.message ?? "Something went wrong";
        if (mounted.current) setState({ pending: false, error: err });
        return { success: false, error: err };
      }
    },
    [],
  );

  const addItem = useCallback(
    (cartId: string, productId: string, price: number, quantity = 1) =>
      wrap(async () => {
        const { data: existing, error: selErr } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("cart_id", cartId)
          .eq("product_id", productId)
          .maybeSingle();

        if (selErr) {
          console.error("Check cart item error:", selErr);
          return { success: false, error: "Failed to add to cart" };
        }

        if (existing?.id) {
          const { error } = await supabase
            .from("cart_items")
            .update({
              quantity: (existing.quantity || 0) + quantity,
              price,
            })
            .eq("id", existing.id);
          if (error) {
            console.error("Update cart item error:", error);
            return { success: false, error: "Failed to update cart" };
          }
        } else {
          const { error } = await supabase.from("cart_items").insert({
            cart_id: cartId,
            product_id: productId,
            quantity,
            price,
          });
          if (error) {
            console.error("Insert cart item error:", error);
            return { success: false, error: "Failed to add to cart" };
          }
        }

        return { success: true };
      }),
    [wrap],
  );

  const updateQuantity = useCallback(
    (cartId: string, itemId: string, quantity: number) =>
      wrap(async () => {
        if (!itemId) {
          return { success: false, error: "Invalid item id" };
        }
        if (quantity < 1) {
          return { success: false, error: "Quantity must be at least 1" };
        }
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("id", itemId)
          .eq("cart_id", cartId);
        if (error) {
          console.error("Update cart item error:", error);
          return { success: false, error: "Failed to update cart item" };
        }
        return { success: true };
      }),
    [wrap],
  );

  const removeItem = useCallback(
    (cartId: string, itemId: string) =>
      wrap(async () => {
        // Guard against undefined/null ids — otherwise PostgREST drops the
        // .eq("id", null) and the delete matches every row in the cart.
        if (!itemId || itemId === "undefined" || itemId === "null") {
          return { success: false, error: "Invalid item id" };
        }
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", itemId)
          .eq("cart_id", cartId);
        if (error) {
          console.error("Remove cart item error:", error);
          return { success: false, error: "Failed to remove item from cart" };
        }
        return { success: true };
      }),
    [wrap],
  );

  const clearCart = useCallback(
    (cartId: string) =>
      wrap(async () => {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("cart_id", cartId);
        if (error) {
          console.error("Clear cart error:", error);
          return { success: false, error: "Failed to clear cart" };
        }
        return { success: true };
      }),
    [wrap],
  );

  return { ...state, addItem, updateQuantity, removeItem, clearCart };
}
