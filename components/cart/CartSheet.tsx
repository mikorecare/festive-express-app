import { useCartMutations } from "@/hooks/cart/useCartMutation";
import { useCart } from "@/providers/CartProvider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ORANGE = "#F49321";
const NAVY = "#1C2D5B";

export function CartSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { cartId, items, count, ready, refresh } = useCart();
  const { removeItem, pending: mutating } = useCartMutations();

  // Refresh the shared cart whenever the sheet opens
  useEffect(() => {
    if (visible && cartId) refresh();
  }, [visible, cartId, refresh]);

  const total = items.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );

  const handleRemove = async (itemId: string | number | undefined) => {
    if (!cartId || itemId == null) return;
    const res = await removeItem(cartId, String(itemId));
    if (res.success) await refresh();
  };

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Pressable
          onPress={onClose}
          style={{ flex: 1 }}
          accessibilityLabel="Close cart"
        />

        <SafeAreaView
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "90%",
            borderWidth: 6,
            borderColor: "#f59e0b",
            borderBottomWidth: 0,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#e2e8f0",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#f59e0b",
                }}
              >
                My Cart
              </Text>
              <Text style={{ marginTop: 4, fontSize: 14, color: NAVY }}>
                Total items: {count}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityLabel="Close cart"
              style={{
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 18,
              }}
            >
              <Ionicons name="close" size={26} color="#94a3b8" />
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            {!ready ? (
              <View style={{ paddingVertical: 48, alignItems: "center" }}>
                <ActivityIndicator />
              </View>
            ) : items.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 48,
                }}
              >
                <Ionicons name="cart-outline" size={64} color="#cbd5e1" />
                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 16,
                    color: "#475569",
                    textAlign: "center",
                  }}
                >
                  Your cart is empty,
                </Text>
                <Pressable onPress={onClose}>
                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#f59e0b",
                      textDecorationLine: "underline",
                    }}
                  >
                    Explore our packages!
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={{ gap: 20 }}>
                {items.map((item) => {
                  const lineTotal =
                    (Number(item.price) || 0) * (Number(item.quantity) || 1);
                  return (
                    <View key={item.id} style={{ gap: 8 }}>
                      <Image
                        source={
                          item.product?.image_url
                            ? { uri: item.product.image_url }
                            : undefined
                        }
                        style={{
                          width: "100%",
                          height: 192,
                          borderRadius: 6,
                          backgroundColor: "#f1f5f9",
                        }}
                        contentFit="cover"
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 18,
                            fontWeight: "800",
                            color: "#f59e0b",
                            textTransform: "uppercase",
                          }}
                          numberOfLines={2}
                        >
                          {item.product?.name ?? "—"}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "800",
                            color: "#f59e0b",
                            marginLeft: 12,
                          }}
                        >
                          USD {lineTotal.toFixed(2)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, color: NAVY }}>
                          Quantity: {item.quantity}
                        </Text>
                        <Pressable
                          onPress={() => handleRemove(item.id)}
                          disabled={mutating}
                          hitSlop={8}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#ef4444",
                              textDecorationLine: "underline",
                            }}
                          >
                            Remove
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View
            style={{
              backgroundColor: NAVY,
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff" }}>Subtotal:</Text>
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#fff" }}>
                USD {total.toFixed(2)}
              </Text>
            </View>

            {items.length > 0 ? (
              <Pressable
                onPress={handleCheckout}
                style={{
                  backgroundColor: ORANGE,
                  borderRadius: 999,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
                accessibilityRole="button"
                accessibilityLabel="Checkout"
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: "#fff",
                  }}
                >
                  Checkout
                </Text>
              </Pressable>
            ) : (
              <View
                style={{
                  backgroundColor: "#94a3b8",
                  borderRadius: 999,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: "#fff",
                  }}
                >
                  Checkout
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
