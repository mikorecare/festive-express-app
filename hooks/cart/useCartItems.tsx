import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_BUCKET = "Products";

export type CartItemProduct = {
  id: string | number;
  name: string;
  price: number | string | null;
  image_url: string | null;
  sku?: string | null;
};

export type CartItem = {
  id: string | number;
  cart_id: string | number;
  product_id: string | number;
  quantity: number;
  price: number | string | null;
  product: CartItemProduct;
};

export type CartItemsResponse = {
  success: boolean;
  items: CartItem[];
  count: number;
};

type State = {
  data: CartItemsResponse | null;
  pending: boolean;
  error: string | null;
};

const toPublicUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;
  const cleanPath = value.replace(/^\/+/, "");
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(cleanPath);
  return data?.publicUrl || value;
};

export function useCartItems(cartId: string | null) {
  const [state, setState] = useState<State>({
    data: null,
    pending: !!cartId,
    error: null,
  });

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchItems = useCallback(async () => {
    if (!cartId) {
      setState({ data: null, pending: false, error: null });
      return;
    }

    setState((s) => ({ ...s, pending: true, error: null }));

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
            id,
            cart_id,
            product_id,
            quantity,
            price,
            product:products (
              id,
              name,
              price,
              image_url,
              sku
            )
          `,
        )
        .eq("cart_id", cartId);

      if (error) {
        console.error("Load cart error:", error);
        if (mounted.current) {
          setState({
            data: null,
            pending: false,
            error: "Failed to load cart",
          });
        }
        return;
      }

      const items: CartItem[] = (data || []).map((item: any) => {
        let product = item.product || {};

        if (Array.isArray(product)) {
          product = product[0] || {};
        }

        const imageUrl = toPublicUrl(product.image_url);

        return {
          ...item,
          product: {
            ...product,
            image_url: imageUrl,
          },
        } as CartItem;
      });

      const count = items.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0,
      );

      if (mounted.current) {
        setState({
          data: { success: true, items, count },
          pending: false,
          error: null,
        });
      }
    } catch (e: any) {
      console.error("Cart load error:", e);
      if (mounted.current) {
        setState({
          data: null,
          pending: false,
          error: e?.message ?? "Failed to load cart",
        });
      }
    }
  }, [cartId]);

  useEffect(() => {
    if (cartId) fetchItems();
  }, [cartId, fetchItems]);

  return {
    data: state.data,
    pending: state.pending,
    error: state.error,
    refetch: fetchItems,
  };
}
