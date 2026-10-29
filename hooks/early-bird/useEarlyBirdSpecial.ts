import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface EarlyBirdSettings {
    early_bird_enabled: boolean;
    early_bird_expires_at: string | null;
    early_bird_title: string;
    early_bird_description: string;
    early_bird_icon_url: string;
    early_bird_icon_secondary_url: string;
}

const DEFAULTS: EarlyBirdSettings = {
    early_bird_enabled: false,
    early_bird_expires_at: null,
    early_bird_title: "Early Bird Special Pricing",
    early_bird_description: "See packages for details.",
    early_bird_icon_url: "",
    early_bird_icon_secondary_url: "",
};

export function useEarlyBirdSpecial() {
    const [settings, setSettings] = useState<EarlyBirdSettings>(DEFAULTS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const fetchEarlyBird = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from("settings")
                .select("key, value")
                .in("key", [
                    "early_bird_enabled",
                    "early_bird_expires_at",
                    "early_bird_title",
                    "early_bird_description",
                    "early_bird_icon_url",
                    "early_bird_icon_secondary_url",
                ]);

            if (error) {
                console.error("Early bird settings fetch error:", error);
                if (mounted.current) setError("Failed to load early bird settings");
                return;
            }

            const next: EarlyBirdSettings = { ...DEFAULTS };

            const rows = (data || []) as { key: string; value: string | null }[];
            for (const row of rows) {
                const value =
                    typeof row.value === "string"
                        ? row.value.replace(/^"|"$/g, "")
                        : row.value;

                switch (row.key) {
                    case "early_bird_enabled":
                        next.early_bird_enabled =
                            value === "true" || value === "1" || value === "yes";
                        break;
                    case "early_bird_expires_at":
                        next.early_bird_expires_at = value as string | null;
                        break;
                    case "early_bird_title":
                        if (value) next.early_bird_title = value as string;
                        break;
                    case "early_bird_description":
                        if (value) next.early_bird_description = value as string;
                        break;
                    case "early_bird_icon_url":
                        next.early_bird_icon_url = (value as string) || "";
                        break;
                    case "early_bird_icon_secondary_url":
                        next.early_bird_icon_secondary_url = (value as string) || "";
                        break;
                }
            }

            if (next.early_bird_icon_url && !next.early_bird_icon_url.startsWith("http")) {
                const cleanPath = next.early_bird_icon_url.replace(/^\/+/, "");
                const { data: urlData } = supabase.storage
                    .from("Products")
                    .getPublicUrl(cleanPath);
                next.early_bird_icon_url =
                    urlData?.publicUrl || next.early_bird_icon_url;
            }

            if (
                next.early_bird_icon_secondary_url &&
                !next.early_bird_icon_secondary_url.startsWith("http")
            ) {
                const cleanPath = next.early_bird_icon_secondary_url.replace(/^\/+/, "");
                const { data: urlData } = supabase.storage
                    .from("Products")
                    .getPublicUrl(cleanPath);
                next.early_bird_icon_secondary_url =
                    urlData?.publicUrl || next.early_bird_icon_secondary_url;
            }

            if (mounted.current) setSettings(next);
        } catch (e: any) {
            console.error("Early bird API error:", e);
            if (mounted.current) {
                setError(e?.message ?? "Failed to load early bird settings");
            }
        } finally {
            if (mounted.current) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEarlyBird();
    }, [fetchEarlyBird]);

    // ------- derived helpers (memoized, same logic as Nuxt) -------

    const isEarlyBirdActive = useCallback(
        (enabled?: boolean, expiresAt?: string | null) => {
            if (!enabled) return false;
            if (!expiresAt) return true;
            return new Date(expiresAt).getTime() > Date.now();
        },
        []
    );

    const isEarlyBirdLive = useMemo(
        () => isEarlyBirdActive(settings.early_bird_enabled, settings.early_bird_expires_at),
        [settings.early_bird_enabled, settings.early_bird_expires_at, isEarlyBirdActive]
    );

    const effectivePrice = useCallback(
        (
            price: number | string | null | undefined,
            salePrice: number | string | null | undefined
        ) => {
            const sale = Number(salePrice);
            const base = Number(price ?? 0);
            if (
                isEarlyBirdLive &&
                salePrice != null &&
                salePrice !== "" &&
                !Number.isNaN(sale) &&
                sale > 0
            ) {
                return sale;
            }
            return base;
        },
        [isEarlyBirdLive]
    );

    const showSale = useCallback(
        (salePrice: number | string | null | undefined) =>
            isEarlyBirdLive &&
            salePrice != null &&
            salePrice !== "" &&
            Number(salePrice) > 0,
        [isEarlyBirdLive]
    );

    const formatEndsLabel = useMemo(() => {
        if (!settings.early_bird_expires_at) return null;
        const date = new Date(settings.early_bird_expires_at);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "America/New_York",
        });
    }, [settings.early_bird_expires_at]);

    const loadEarlyBird = fetchEarlyBird;

    return {
        earlyBirdExpiresAt: settings.early_bird_expires_at,
        earlyBirdEnabled: settings.early_bird_enabled,
        earlyBirdTitle: settings.early_bird_title,
        earlyBirdDescription: settings.early_bird_description,
        earlyBirdIconUrl: settings.early_bird_icon_url,
        earlyBirdIconSecondaryUrl: settings.early_bird_icon_secondary_url,

        isEarlyBirdLive,
        isEarlyBirdActive,
        effectivePrice,
        showSale,
        formatEndsLabel,

        loadEarlyBird,
        isLoading,
        error,
    };
}