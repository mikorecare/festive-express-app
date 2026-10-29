import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export interface HeroSettings {
    hero_h1_white: string;
    hero_h1_orange: string;
    hero_description_1: string;
    hero_description_2: string;
    hero_button_label: string;
    hero_countdown_enabled: boolean;
}

const DEFAULTS: HeroSettings = {
    hero_h1_white: "RENT THE MAGIC",
    hero_h1_orange: "ENJOY THE SEASON",
    hero_description_1: "Giftwrapped in One Simple Package.",
    hero_description_2: "(No ladders. No tangled cords. No storage. No stress.)",
    hero_button_label: "Explore the Packages",
    hero_countdown_enabled: true,
};

const unwrap = (value: unknown): string => {
    if (value == null) return "";
    if (typeof value === "string") return value.replace(/^"|"$/g, "");
    return String(value);
};

export function useHeroSettings() {
    const [heroH1White, setHeroH1White] = useState(DEFAULTS.hero_h1_white);
    const [heroH1Orange, setHeroH1Orange] = useState(DEFAULTS.hero_h1_orange);
    const [heroDescription1, setHeroDescription1] = useState(DEFAULTS.hero_description_1);
    const [heroDescription2, setHeroDescription2] = useState(DEFAULTS.hero_description_2);
    const [heroButtonLabel, setHeroButtonLabel] = useState(DEFAULTS.hero_button_label);
    const [heroCountdownEnabled, setHeroCountdownEnabled] = useState(DEFAULTS.hero_countdown_enabled);
    const [isLoading, setIsLoading] = useState(false);

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const loadHeroSettings = useCallback(async () => {
        setIsLoading(true);

        try {
            const { data, error } = await supabase
                .from("settings")
                .select("key, value")
                .in("key", [
                    "hero_h1_white",
                    "hero_h1_orange",
                    "hero_description_1",
                    "hero_description_2",
                    "hero_button_label",
                    "hero_countdown_enabled",
                ]);

            if (error) throw error;

            const rows = (data || []) as { key: string; value: string | null }[];

            let next = { ...DEFAULTS };

            for (const row of rows) {
                const value = unwrap(row.value);

                switch (row.key) {
                    case "hero_h1_white":
                        if (value) next.hero_h1_white = value;
                        break;
                    case "hero_h1_orange":
                        if (value) next.hero_h1_orange = value;
                        break;
                    case "hero_description_1":
                        if (value) next.hero_description_1 = value;
                        break;
                    case "hero_description_2":
                        if (value) next.hero_description_2 = value;
                        break;
                    case "hero_button_label":
                        if (value) next.hero_button_label = value;
                        break;
                    case "hero_countdown_enabled":
                        next.hero_countdown_enabled =
                            value === "true" || value === "1" || value === "yes";
                        break;
                }
            }

            if (!mounted.current) return;

            // if (next.hero_h1_white) {
            //   setHeroH1White(next.hero_h1_white);
            // }
            // if (next.hero_h1_orange) {
            //   setHeroH1Orange(next.hero_h1_orange);
            // }
            // if (next.hero_description_1) {
            //   setHeroDescription1(next.hero_description_1);
            // }
            // if (next.hero_description_2) {
            //   setHeroDescription2(next.hero_description_2);
            // }
            // if (next.hero_button_label) {
            //   setHeroButtonLabel(next.hero_button_label);
            // }
            setHeroCountdownEnabled(next.hero_countdown_enabled);
        } catch (e) {
            console.error("loadHeroSettings", e);
        } finally {
            if (mounted.current) setIsLoading(false);
        }
    }, []);

    return {
        heroH1White,
        heroH1Orange,
        heroDescription1,
        heroDescription2,
        heroButtonLabel,
        heroCountdownEnabled,
        loadHeroSettings,
        isLoading,
    };
}