import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

const BUCKET = "Products";

export type InclusionItem = {
    id: string;
    name: string;
    slug?: string;
    image_url?: string | null;
};

export type PackageInclusion = {
    quantity: number;
    is_included: boolean;
    label_override?: string | null;
    sort_order?: number;
    inclusion_items?: InclusionItem | null;
};

export type PackageRow = {
    id: string | number;
    name: string;
    slug: string;
    description?: string | null;
    price?: number | string | null;
    sale_price?: number | string | null;
    title_image_url?: string | null;
    icon_url?: string | null;
    is_popular?: boolean;
    sort_order?: number;
    package_inclusions?: PackageInclusion[];
};

export type PackagesMainListResponse = {
    success: boolean;
    data: PackageRow[];
};

type State = {
    data: PackagesMainListResponse | null;
    pending: boolean;
    error: string | null;
};

const toPublicUrl = (value: string | null | undefined): string | null => {
    if (!value) return value ?? null;
    if (/^https?:\/\//.test(value)) return value;
    const cleanPath = value.replace(/^\/+/, "");
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(cleanPath);
    return data?.publicUrl || value;
};

export function usePackagesMainList() {
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

    const fetchPackages = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("packages")
                .select(
                    `
            id,
            name,
            slug,
            description,
            price,
            sale_price,
            title_image_url,
            icon_url,
            is_popular,
            sort_order,
            package_inclusions (
              quantity,
              is_included,
              label_override,
              sort_order,
              inclusion_items (
                id,
                name,
                slug,
                image_url
              )
            )
          `
                )
                .eq("is_active", true)
                .order("sort_order", { ascending: true });

            if (error) {
                console.error("Packages fetch error:", error);
                if (mounted.current) {
                    setState({
                        data: { success: false, data: [] },
                        pending: false,
                        error: "Failed to load packages",
                    });
                }
                return;
            }

            const transformed: PackageRow[] = (data || []).map((pkg: any) => {
                const titleImageUrl = toPublicUrl(pkg.title_image_url);
                const iconUrl = toPublicUrl(pkg.icon_url);

                const transformedInclusions = (pkg.package_inclusions || []).map(
                    (inclusion: any) => {
                        if (inclusion.inclusion_items) {
                            const inclusionImageUrl = toPublicUrl(
                                inclusion.inclusion_items.image_url
                            );
                            return {
                                ...inclusion,
                                inclusion_items: {
                                    ...inclusion.inclusion_items,
                                    image_url: inclusionImageUrl,
                                },
                            };
                        }
                        return inclusion;
                    }
                );

                return {
                    ...pkg,
                    title_image_url: titleImageUrl,
                    icon_url: iconUrl,
                    package_inclusions: transformedInclusions,
                } as PackageRow;
            });

            if (mounted.current) {
                setState({
                    data: { success: true, data: transformed },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("Packages API error:", e);
            if (mounted.current) {
                setState({
                    data: { success: false, data: [] },
                    pending: false,
                    error: e?.message ?? "Failed to load packages",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchPackages,
    };
}