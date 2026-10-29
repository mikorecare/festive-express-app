import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_BUCKET = "Gallery";

export type GalleryItemRaw = {
    id: number | string;
    year?: string | null;
    description?: string | null;
    image_url?: string | null;
    image_position?: "left" | "right" | null;
    divider_image_url?: string | null;
    sort_order?: number;
    is_active?: boolean;
    [key: string]: any;
};

export type TimelineItem = {
    id: number | string;
    year: string;
    description: string;
    image: string | null;
    imagePosition: "left" | "right";
    dividerImage: string | null;
};

export type GalleryApiResponse = {
    success: boolean;
    data: TimelineItem[];
    error?: string;
};

type State = {
    data: GalleryApiResponse | null;
    pending: boolean;
    error: string | null;
};

export function useGallery() {
    const [state, setState] = useState<State>({
        data: null,
        pending: true,
        error: null,
    });

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const fetchGallery = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("gallery_items")
                .select("*")
                .eq("is_active", true)
                .order("sort_order", { ascending: true });

            if (error) throw error;

            const transformed: TimelineItem[] = (data || []).map((item: GalleryItemRaw) => {
                let imageUrl = item.image_url ?? null;
                if (imageUrl && !/^https?:\/\//.test(imageUrl)) {
                    const cleanPath = imageUrl.replace(/^\/+/, "");
                    const { data: urlData } = supabase.storage
                        .from(STORAGE_BUCKET)
                        .getPublicUrl(cleanPath);
                    imageUrl = urlData?.publicUrl || imageUrl;
                }

                let dividerImageUrl = item.divider_image_url ?? null;
                if (dividerImageUrl && !/^https?:\/\//.test(dividerImageUrl)) {
                    const cleanPath = dividerImageUrl.replace(/^\/+/, "");
                    const { data: urlData } = supabase.storage
                        .from(STORAGE_BUCKET)
                        .getPublicUrl(cleanPath);
                    dividerImageUrl = urlData?.publicUrl || dividerImageUrl;
                }

                return {
                    id: item.id,
                    year: item.year || "",
                    description: item.description || "",
                    image: imageUrl,
                    imagePosition: item.image_position === "left" ? "left" : "right",
                    dividerImage: dividerImageUrl,
                };
            });

            if (mounted.current) {
                setState({
                    data: { success: true, data: transformed },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("Error fetching gallery items:", e);
            if (mounted.current) {
                setState({
                    data: {
                        success: false,
                        data: [],
                        error: e?.message ?? "Failed to fetch gallery items",
                    },
                    pending: false,
                    error: e?.message ?? "Failed to fetch gallery items",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchGallery,
    };
}