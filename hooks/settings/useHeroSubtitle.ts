import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSubtitleResponse = {
    success: boolean;
    data: { hero_subtitle: string };
};

type State = {
    data: HeroSubtitleResponse | null;
    pending: boolean;
    error: string | null;
};

const DEFAULT_SUBTITLE = "Choose the perfect package|for your home";

export function useHeroSubtitle() {
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

    const fetchHeroSubtitle = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("settings")
                .select("key, value")
                .eq("key", "hero_subtitle")
                .maybeSingle();

            if (error) {
                console.error("Hero settings fetch error:", error);
                if (mounted.current) {
                    setState({
                        data: { success: false, data: { hero_subtitle: DEFAULT_SUBTITLE } },
                        pending: false,
                        error: "Failed to load hero settings",
                    });
                }
                return;
            }

            let hero_subtitle = DEFAULT_SUBTITLE;
            if (data) {
                const value =
                    typeof data.value === "string"
                        ? data.value.replace(/^"|"$/g, "")
                        : data.value;
                if (value) hero_subtitle = value;
            }

            if (mounted.current) {
                setState({
                    data: { success: true, data: { hero_subtitle } },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("Hero settings API error:", e);
            if (mounted.current) {
                setState({
                    data: { success: false, data: { hero_subtitle: DEFAULT_SUBTITLE } },
                    pending: false,
                    error: e?.message ?? "Failed to load hero settings",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchHeroSubtitle();
    }, [fetchHeroSubtitle]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchHeroSubtitle,
    };
}