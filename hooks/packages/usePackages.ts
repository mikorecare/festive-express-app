import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_BUCKET = "Products";

export type InclusionItem = {
    id: string;
    name: string;
    image_url: string | null;
};

export type PackageInclusion = {
    id: string;
    is_included: boolean;
    inclusion_items: InclusionItem | null;
};

export type Package = {
    id: string;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    description: string | null;
    max_roofline_ft: number | null;
    features: any | null;
    is_popular: boolean;
    color: string | null;
    title_image_url: string | null;
    icon_url: string | null;
    image_url: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    package_inclusions: PackageInclusion[];
};


interface PackageOption {
    name: string;
    image_url?: string | null;
}

interface PackageVariation {
    name?: string;
    options?: PackageOption[];
}

export interface PackageRow {
    id: string | number;
    name: string;
    slug: string;
    price: number | string | null;
    sale_price: number | string | null;
    is_popular?: boolean;
    is_package?: boolean;
    package_data?: string | null;
    image_url?: string | null;
    icon_url?: string | null;
    variations?: PackageVariation[];
    package_inclusions?: any[];
    inclusions?: any[];
    title_image_url: string | null;
    description?: string | null;
}

export type PackagesResponse = {
    packages: Package[];
};

type State = {
    data: PackagesResponse | null;
    pending: boolean;
    error: string | null;
};

const toPublicUrl = (value: string | null): string | null => {
    if (!value) return value;
    if (/^https?:\/\//.test(value)) return value;
    const cleanPath = value.replace(/^\/+/, "");
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(cleanPath);
    return data?.publicUrl || value;
};

export function usePackages() {
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
            *,
            package_inclusions (
              id,
              is_included,
              inclusion_items (
                id,
                name,
                image_url
              )
            )
          `
                )
                .order("sort_order", { ascending: true })
                .order("id", { ascending: true });

            if (error) {
                console.error("packages list", error);
                if (mounted.current) {
                    setState({
                        data: null,
                        pending: false,
                        error: "Failed to load packages",
                    });
                }
                return;
            }

            const transformedPackages: Package[] = (data || []).map((pkg: any) => {
                const titleImageUrl = toPublicUrl(pkg.title_image_url);
                const imageUrl = toPublicUrl(pkg.image_url);
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
                    image_url: imageUrl,
                    icon_url: iconUrl,
                    package_inclusions: transformedInclusions,
                } as Package;
            });

            if (mounted.current) {
                setState({
                    data: { packages: transformedPackages },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("packages list", e);
            if (mounted.current) {
                setState({
                    data: null,
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