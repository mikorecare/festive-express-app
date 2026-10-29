import * as ImageManipulator from "expo-image-manipulator";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePackagesMainList } from "../packages/usePackagesMainList";

// --- types (copied from web) ---
export type ColorOption = {
    scheme: string;
    label: string;
    sw?: string;
};

export type Suggestion = {
    placeId: string;
    full: string;
    main: string;
    secondary: string;
};

export type MultiColor = { hex: string; name: string };

export type RenderStats = {
    rooflineFeet?: number;
    frontFeet?: number;
    groundFeet?: number;
    packageOverageFt?: number;
    overagePrice?: number | null;
    estimatedTotal?: number | null;
    package?: string;
    packageName?: string;
    packageIncludedFt?: number;
    pricePerFoot?: number;
    withinPackage?: boolean;
};

export type RenderResult = {
    ok: boolean;
    error?: string;
    address?: string;
    imageUrl?: string;
    stats?: RenderStats;
    streetView?: { verifiedAddress?: string };
};

export type PackageOption = "joy" | "jolly" | "merry";

export type IPackageOption = {
    id: PackageOption;
    name: string;
    previousPrice: number;
    price: number;
    includedFt: number;
    title: string;
    isPopular: boolean;
    color: string | null;
    icon: string | null;
    description: string | null;
    features: any;
};

const PACKAGE_TOTAL_FT = 175;
const MAX_ROOFLINE_FT = 125;
const MAX_GROUND_FT = 50;
const OVERAGE_RATE = 10;

const FACTS = [
    "Festive Express installs your lights — you relax and enjoy the season.",
    "Professional C-9 roofline lighting, installed and removed for you.",
    "One simple rental package — no ladders, no tangled cords, no storage.",
    "We handle install, maintenance, and takedown when the season ends.",
    "Licensed & insured technicians — your home is fully protected.",
    "Finding your roofline…",
    "Placing C-9 lights along every eave and peak…",
    "Adding the festive evening glow…",
];

const PROGRESS_STEPS = [
    "Finding your house…",
    "Reading the roofline…",
    "Placing the lights…",
    "Setting the evening glow…",
    "Almost there…",
];

export function formatMoney(n: number): string {
    return "$" + Number(n).toLocaleString("en-US");
}

export function useEstimator() {
    // --- form state ---
    const [address, setAddress] = useState("");
    const [placeId, setPlaceId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedScheme, setSelectedScheme] = useState("warm-white");
    const [selectedPackage, setSelectedPackage] = useState<PackageOption>("joy");
    const [multiColors, setMultiColors] = useState<MultiColor[]>([
        { hex: "#e21d1d", name: "Color 1" },
        { hex: "#1ea832", name: "Color 2" },
        { hex: "#1d6fe2", name: "Color 3" },
        { hex: "#f2c14e", name: "Color 4" },
        { hex: "#9b4dca", name: "Color 5" },
    ]);
    const { data: pkgsData, pending: loadingPackages, error: pkgError } = usePackagesMainList();

    const packageOptions: IPackageOption[] = (pkgsData?.success ? pkgsData.data : []).map((pkg) => ({
        id: pkg.slug as PackageOption,
        name: pkg.name,
        previousPrice: Math.round(Number(pkg.price) || 0),
        price: Math.round(Number(pkg.sale_price) || 0),
        includedFt: PACKAGE_TOTAL_FT,
        title: pkg.title_image_url ?? pkg.icon_url ?? "",
        isPopular: pkg.is_popular ?? false,
        color: null,
        icon: pkg.icon_url ?? null,
        description: pkg.description ?? null,
        features: null,
    }));

    const packageError = pkgError;

    // --- image state ---
    const [imagePreview, setImagePreview] = useState("");
    const [imageBase64, setImageBase64] = useState("");

    // --- suggestions ---
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);

    // --- result ---
    const [result, setResult] = useState<RenderResult | null>(null);
    const [rendering, setRendering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [renderError, setRenderError] = useState("");
    const [resultNote, setResultNote] = useState("");
    const [booking, setBooking] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<{ name?: string; email?: string; address?: string }>({});

    // --- progress UI ---
    const [currentFact, setCurrentFact] = useState(FACTS[0]);
    const [progressText, setProgressText] = useState(PROGRESS_STEPS[0]);

    const factInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- color options ---
    const colorOptions: ColorOption[] = [
        { scheme: "warm-white", label: "Warm White", sw: "#fff3d6" },
        { scheme: "pure-white", label: "Pure White", sw: "#ffffff" },
        { scheme: "champagne", label: "Champagne", sw: "#e6c9a0" },
        { scheme: "candy-cane", label: "Candy Cane" },
        { scheme: "multicolor", label: "Multicolor" },
    ];

    // --- computed ---
    const selectedPackageData = packageOptions.find((p) => p.id === selectedPackage);

    useEffect(() => {
        if (packageOptions.length > 0) {
            const exists = packageOptions.some((p) => p.id === selectedPackage);
            if (!exists) {
                setSelectedPackage(packageOptions[0].id);
            }
        }
    }, [packageOptions.length]);

    const multiColorPreview = (() => {
        const preview: string[] = [];
        for (let cycle = 0; cycle < 2; cycle++) {
            multiColors.forEach((color) => {
                for (let n = 0; n < 3; n++) preview.push(color.hex);
            });
        }
        return preview;
    })();

    const getTotalFeet = (stats: RenderStats | null | undefined): number => {
        if (!stats) return 0;
        return (stats.rooflineFeet || stats.frontFeet || 0) + (stats.groundFeet || 0);
    };

    const getRooflineFeet = (stats: RenderStats | null | undefined): number => {
        if (!stats) return 0;
        return stats.rooflineFeet || stats.frontFeet || 0;
    };

    const getGroundFeet = (stats: RenderStats | null | undefined): number => {
        if (!stats) return 0;
        return stats.groundFeet || 0;
    };

    const calculatedOverageFt = (() => {
        if (!result?.stats) return 0;
        const totalFt = getTotalFeet(result.stats);
        return totalFt > PACKAGE_TOTAL_FT ? Math.max(0, totalFt - PACKAGE_TOTAL_FT) : 0;
    })();

    const calculatedOveragePrice = (() => {
        if (calculatedOverageFt <= 0) return null;
        return Math.round((calculatedOverageFt * OVERAGE_RATE) / 10) * 10;
    })();

    const totalEstimate = (() => {
        if (!selectedPackageData) return null;
        return selectedPackageData.price + (calculatedOveragePrice || 0);
    })();

    const isWithinPackage = (() => {
        if (!result?.stats) return true;
        return getTotalFeet(result.stats) <= PACKAGE_TOTAL_FT;
    })();

    const statsCards = (() => {
        const s = result?.stats;
        if (!s) return [];
        const cards: { label: string; value: string }[] = [];
        const rooflineFt = getRooflineFeet(s);
        const groundFt = getGroundFeet(s);
        const totalFt = getTotalFeet(s);

        if (rooflineFt > 0) cards.push({ label: "Roofline footage", value: `${Math.round(rooflineFt)} ft` });
        if (groundFt > 0) cards.push({ label: "Ground lights", value: `${Math.round(groundFt)} ft` });
        if (totalFt > 0) cards.push({ label: "Total footage", value: `${Math.round(totalFt)} ft` });

        const pkg = selectedPackageData;
        if (pkg) cards.push({ label: `${pkg.name} — Early Bird Special`, value: formatMoney(pkg.price) });

        cards.push({
            label: "Package includes",
            value: `Up to ${PACKAGE_TOTAL_FT} ft total (${MAX_ROOFLINE_FT} ft roofline + ${MAX_GROUND_FT} ft ground)`,
        });

        if (calculatedOverageFt > 0) {
            cards.push({ label: "Extra footage needed", value: `+${Math.round(calculatedOverageFt)} ft` });
            if (calculatedOveragePrice !== null) {
                cards.push({ label: `Extra at $${OVERAGE_RATE}/ft`, value: formatMoney(calculatedOveragePrice) });
            }
            if (totalEstimate !== null) {
                cards.push({ label: "Total estimate", value: formatMoney(totalEstimate) });
            }
        } else {
            cards.push({ label: "Package coverage", value: "✓ Your home is covered" });
        }
        return cards;
    })();

    const showOffer = calculatedOverageFt > 0;

    // --- image picker + downscale ---
    const handleImagePicked = useCallback(async (uri: string) => {
        setError("");
        try {
            const manipulated = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1280 } }],
                { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            );
            const dataUrl = `data:image/jpeg;base64,${manipulated.base64}`;
            setImageBase64(dataUrl);
            setImagePreview(manipulated.uri);
        } catch {
            setError("Could not read that image. Try a different photo.");
        }
    }, []);
    console.log(process.env.EXPO_PUBLIC_API_BASE_URL)
    // --- address autocomplete ---
    const debouncedSearch = useCallback((q: string) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            if (q.trim().length < 3) {
                setSuggestions([]);
                return;
            }
            try {
                const res = await fetch(
                    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/places/autocomplete?q=${encodeURIComponent(q.trim())}`,
                    { method: "GET" }
                );
                if (!res.ok) {
                    setSuggestions([]);
                    return;
                }
                const data = await res.json();
                setSuggestions(data.suggestions ?? []);
            } catch (e) {
                console.error("[places autocomplete]", e);
                setSuggestions([]);
            }
        }, 250);
    }, []);

    const selectAddress = useCallback((s: Suggestion) => {
        setPlaceId(s.placeId);
        setAddress(s.full);
        setSuggestions([]);
        setSuggestionsOpen(false);
        setErrors((e) => ({ ...e, address: undefined }));
    }, []);

    const updateMultiColor = useCallback((index: number, hex: string) => {
        setMultiColors((arr) => arr.map((c, i) => (i === index ? { ...c, hex } : c)));
    }, []);

    // --- form validation ---
    const validateForm = useCallback((previewOnly: boolean) => {
        const next: typeof errors = {};
        if (!address.trim()) next.address = "Address is required";
        if (!previewOnly) {
            if (!name.trim()) next.name = "Name is required";
            if (!email || !email.includes("@")) next.email = "Valid email is required";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }, [address, name, email]);

    // --- facts rotation during render ---
    const startFacts = () => {
        let factIdx = 0;
        let progIdx = 0;
        setCurrentFact(FACTS[0]);
        setProgressText(PROGRESS_STEPS[0]);
        if (factInterval.current) clearInterval(factInterval.current);
        factInterval.current = setInterval(() => {
            factIdx = (factIdx + 1) % FACTS.length;
            setCurrentFact(FACTS[factIdx]);
            progIdx = Math.min(progIdx + 1, PROGRESS_STEPS.length - 1);
            setProgressText(PROGRESS_STEPS[progIdx]);
        }, 2600);
    };

    const stopFacts = () => {
        if (factInterval.current) {
            clearInterval(factInterval.current);
            factInterval.current = null;
        }
    };

    useEffect(() => {
        return () => {
            stopFacts();
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, []);


    // --- submit render ---
    const submitRender = useCallback(
        async (previewOnly: boolean, turnstileToken?: string) => {
            setError("");
            setIsPreview(previewOnly);
            if (!validateForm(previewOnly)) return;

            setRendering(true);
            setIsLoading(true);
            setResult(null);
            setRenderError("");
            startFacts();

            try {
                // Call Nuxt endpoint via fetch (or Supabase Edge Function)
                const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/estimate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "render",
                        previewOnly,
                        address,
                        placeId: placeId || undefined,
                        email: email || undefined,
                        name,
                        phone,
                        scheme: selectedScheme,
                        serviceType: "christmas",
                        package: selectedPackage,
                        turnstileToken,
                    }),
                });

                const response: RenderResult = await res.json();

                if (!response.ok) {
                    const code = response.error;
                    let msg = "We couldn't render that one. Please try another photo or address.";
                    if (code === "bad_image" || code === "no_photo") msg = "That photo didn't come through. Try uploading a different one.";
                    else if (code === "no_house_found") msg = "No house found at this location. Try a different address or upload a photo.";
                    else if (code === "address_not_found" || code === "no_streetview") msg = "We couldn't find a street view for that address. Try a different address or upload a photo.";
                    else if (code === "server_not_configured") msg = "The render service isn't configured yet. Please add your API keys.";
                    setRenderError(msg);
                    return;
                }

                setResult(response);

                if (previewOnly) {
                    const verified = response.streetView?.verifiedAddress || "";
                    const addressPart = verified ? ` (camera aimed at lot verified as ${verified.split(",")[0]})` : "";
                    setResultNote(
                        response.address
                            ? `Street View for ${response.address}${addressPart}. Footage estimated from the building footprint — same method as a design quote. No lighting on this preview.`
                            : "Footage estimated from the building footprint. No lighting on this preview."
                    );
                } else {
                    const pkg = selectedPackageData;
                    const totalFt = response.stats ? getTotalFeet(response.stats) : 0;
                    let note = `Estimate for ${response.address || "your home"}. `;
                    note += `Package: ${pkg?.name || "Selected"} (up to ${PACKAGE_TOTAL_FT} ft total). `;
                    if (calculatedOverageFt > 0) {
                        note += `Your home needs ${Math.round(totalFt)} ft total, which is ${Math.round(calculatedOverageFt)} ft over the package. `;
                        note += `Add ${Math.round(calculatedOverageFt)} ft at $${OVERAGE_RATE}/ft = ${formatMoney(calculatedOveragePrice || 0)}. `;
                    } else {
                        note += `Your home's ${Math.round(totalFt)} ft is covered by the package. `;
                    }
                    note += `Final pricing confirmed at your free on-site measurement.`;
                    setResultNote(note);
                }
            } catch (e: any) {
                setRenderError(e?.message ?? "Network hiccup. Please try again.");
            } finally {
                stopFacts();
                setRendering(false);
                setIsLoading(false);
            }
        },
        [address, placeId, email, name, phone, selectedScheme, selectedPackage, validateForm, selectedPackageData, calculatedOverageFt, calculatedOveragePrice]
    );

    // --- book consultation ---
    const bookConsultation = useCallback(
        async (turnstileToken?: string) => {
            if (!email || !email.includes("@")) {
                setResultNote("Enter a valid email on the form so we can book your consultation.");
                return;
            }
            setBooking(true);
            try {
                const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/estimate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "book",
                        previewOnly: false,
                        address,
                        placeId: placeId || undefined,
                        email,
                        name,
                        phone,
                        scheme: selectedScheme,
                        serviceType: "christmas",
                        package: selectedPackage,
                        totalEstimate,
                        packageName: selectedPackageData?.name,
                        overageFt: calculatedOverageFt,
                        overagePrice: calculatedOveragePrice,
                        totalFt: result?.stats ? getTotalFeet(result.stats) : 0,
                        imageUrl: result?.imageUrl || "",
                        turnstileToken,
                    }),
                });
                const response: RenderResult = await res.json();
                if (!response.ok) throw new Error("Booking failed");
                setResultNote("Thanks — we received your design and contact info. We'll be in touch.");
            } catch {
                setResultNote("Could not send your request. Please try again.");
            } finally {
                setBooking(false);
            }
        },
        [email, address, placeId, name, phone, selectedScheme, selectedPackage, totalEstimate, selectedPackageData, calculatedOverageFt, calculatedOveragePrice, result]
    );

    const reset = useCallback(() => {
        setResult(null);
        setRenderError("");
        setRendering(false);
        setError("");
        stopFacts();
    }, []);

    return {
        // state
        address, setAddress,
        placeId,
        name, setName,
        email, setEmail,
        phone, setPhone,
        selectedScheme, setSelectedScheme,
        selectedPackage, setSelectedPackage,
        multiColors, updateMultiColor,
        imagePreview, imageBase64,
        suggestions, suggestionsOpen, setSuggestionsOpen,
        packageOptions, loadingPackages, packageError,
        result, rendering, isLoading, renderError, resultNote, booking, isPreview, error, errors,
        currentFact, progressText,

        // derived
        colorOptions,
        multiColorPreview,
        selectedPackageData,
        calculatedOverageFt,
        calculatedOveragePrice,
        totalEstimate,
        isWithinPackage,
        statsCards,
        showOffer,

        // constants
        PACKAGE_TOTAL_FT,
        MAX_ROOFLINE_FT,
        MAX_GROUND_FT,
        OVERAGE_RATE,

        // methods
        formatMoney,
        handleImagePicked,
        debouncedSearch,
        selectAddress,
        submitRender,
        bookConsultation,
        reset,
        getTotalFeet,
        getRooflineFeet,
        getGroundFeet,
    };
}