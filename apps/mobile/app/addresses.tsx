import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { colors, fonts, spacing } from "@/lib/theme";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/skeleton";
import { ErrorState } from "@/components/error-state";

interface AddressData {
  readonly id: string;
  readonly label: string | null;
  readonly name: string;
  readonly phone: string;
  readonly line1: string;
  readonly line2: string | null;
  readonly city: string;
  readonly state: string | null;
  readonly postalCode: string;
  readonly country: string;
  readonly isDefault: boolean;
}

interface AddressFormState {
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddressFormState = {
  label: "",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  isDefault: false,
};

export default function AddressesScreen() {
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);

  const utils = trpc.useUtils();
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.address.list.useQuery();

  const createMutation = trpc.address.create.useMutation({
    onSuccess: () => {
      void utils.address.list.invalidate();
      closeForm();
    },
  });

  const updateMutation = trpc.address.update.useMutation({
    onSuccess: () => {
      void utils.address.list.invalidate();
      closeForm();
    },
  });

  const deleteMutation = trpc.address.delete.useMutation({
    onSuccess: () => void utils.address.list.invalidate(),
  });

  const setDefaultMutation = trpc.address.setDefault.useMutation({
    onSuccess: () => void utils.address.list.invalidate(),
  });

  const addresses = (response?.data ?? []) as unknown as ReadonlyArray<AddressData>;

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function openEditForm(address: AddressData) {
    setEditingId(address.id);
    setForm({
      label: address.label ?? "",
      name: address.name,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state ?? "",
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setFormVisible(true);
  }

  function closeForm() {
    setFormVisible(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleSave() {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.postalCode) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    const data = {
      label: form.label || undefined,
      name: form.name,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      state: form.state || undefined,
      postalCode: form.postalCode,
      country: "KR",
      isDefault: form.isDefault,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function handleDelete(id: string) {
    Alert.alert("Delete Address", "Are you sure you want to remove this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMutation.mutate({ id });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    ]);
  }

  function updateField(field: keyof AddressFormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>ADDRESSES</Text>
        <Pressable onPress={openCreateForm} hitSlop={12}>
          <Ionicons name="add" size={24} color={colors.charcoal} />
        </Pressable>
      </View>

      {isError ? (
        <ErrorState
          title="Couldn't load addresses"
          message={error?.message ?? "Please try again."}
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <View style={styles.skeletonList}>
          {[1, 2].map((i) => (
            <View key={i} style={styles.addressCard}>
              <Skeleton width={80} height={12} />
              <Skeleton width="60%" height={16} style={{ marginTop: 8 }} />
              <Skeleton width="90%" height={14} style={{ marginTop: 6 }} />
              <Skeleton width="70%" height={14} style={{ marginTop: 4 }} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={addresses}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.addressCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardLabels}>
                  {item.label && <Text style={styles.label}>{item.label}</Text>}
                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardActions}>
                  <Pressable onPress={() => openEditForm(item)} hitSlop={8}>
                    <Ionicons name="create-outline" size={18} color={colors.warmGray} />
                  </Pressable>
                  <Pressable onPress={() => handleDelete(item.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={18} color={colors.warmGray} />
                  </Pressable>
                </View>
              </View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>{item.phone}</Text>
              <Text style={styles.detail}>
                {item.line1}
                {item.line2 ? `, ${item.line2}` : ""}
              </Text>
              <Text style={styles.detail}>
                {item.city}
                {item.state ? `, ${item.state}` : ""} {item.postalCode}
              </Text>
              {!item.isDefault && (
                <Pressable
                  style={styles.setDefaultBtn}
                  onPress={() => {
                    setDefaultMutation.mutate({ id: item.id });
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={styles.setDefaultText}>Set as default</Text>
                </Pressable>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="location-outline" size={48} color={colors.lightGray} />
              <Text style={styles.emptyTitle}>No addresses yet</Text>
              <Text style={styles.emptySubtitle}>Add a shipping address to get started</Text>
              <Pressable style={styles.addBtn} onPress={openCreateForm}>
                <Text style={styles.addBtnText}>ADD ADDRESS</Text>
              </Pressable>
            </View>
          }
        />
      )}

      {/* Address Form Modal */}
      <Modal
        visible={formVisible}
        animationType="slide"
        transparent
        onRequestClose={closeForm}
      >
        <Pressable style={styles.overlay} onPress={closeForm} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetWrap}
        >
          <ScrollView style={styles.sheet} showsVerticalScrollIndicator={false}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>
              {editingId ? "Edit Address" : "New Address"}
            </Text>

            <FormField
              label="Label (optional)"
              placeholder="Home, Office..."
              value={form.label}
              onChangeText={(v) => updateField("label", v)}
            />
            <FormField
              label="Full Name *"
              placeholder="Recipient name"
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
            />
            <FormField
              label="Phone *"
              placeholder="010-0000-0000"
              value={form.phone}
              onChangeText={(v) => updateField("phone", v)}
              keyboardType="phone-pad"
            />
            <FormField
              label="Address Line 1 *"
              placeholder="Street address"
              value={form.line1}
              onChangeText={(v) => updateField("line1", v)}
            />
            <FormField
              label="Address Line 2"
              placeholder="Apt, suite, unit..."
              value={form.line2}
              onChangeText={(v) => updateField("line2", v)}
            />
            <View style={styles.formRow}>
              <View style={{ flex: 1 }}>
                <FormField
                  label="City *"
                  placeholder="City"
                  value={form.city}
                  onChangeText={(v) => updateField("city", v)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormField
                  label="Postal Code *"
                  placeholder="12345"
                  value={form.postalCode}
                  onChangeText={(v) => updateField("postalCode", v)}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <FormField
              label="State / Province"
              placeholder="Optional"
              value={form.state}
              onChangeText={(v) => updateField("state", v)}
            />

            <Pressable
              style={styles.defaultToggle}
              onPress={() => updateField("isDefault", !form.isDefault)}
            >
              <Ionicons
                name={form.isDefault ? "checkbox" : "square-outline"}
                size={22}
                color={form.isDefault ? colors.charcoal : colors.warmGray}
              />
              <Text style={styles.defaultToggleText}>Set as default shipping address</Text>
            </Pressable>

            <Pressable
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Text style={styles.saveBtnText}>
                {createMutation.isPending || updateMutation.isPending ? "SAVING..." : "SAVE"}
              </Text>
            </Pressable>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

interface FormFieldProps {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly keyboardType?: "default" | "phone-pad" | "number-pad";
}

function FormField({ label, placeholder, value, onChangeText, keyboardType = "default" }: FormFieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor={colors.lightGray}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: 56,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    letterSpacing: 3,
    color: colors.charcoal,
  },
  list: { padding: spacing.md, gap: spacing.md },
  skeletonList: { padding: spacing.md, gap: spacing.md },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cardLabels: { flexDirection: "row", gap: 8, alignItems: "center" },
  label: { fontSize: 10, letterSpacing: 1.5, color: colors.warmGray, textTransform: "uppercase" },
  defaultBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: { fontSize: 9, letterSpacing: 1, color: colors.white, fontWeight: "600" },
  cardActions: { flexDirection: "row", gap: 12 },
  name: { fontSize: 15, fontWeight: "600", color: colors.charcoal },
  detail: { fontSize: 13, color: colors.warmGray, marginTop: 2, lineHeight: 20 },
  setDefaultBtn: { marginTop: spacing.sm },
  setDefaultText: { fontSize: 12, color: colors.charcoal, textDecorationLine: "underline" },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.charcoal,
    marginTop: spacing.md,
  },
  emptySubtitle: { fontSize: 13, color: colors.warmGray, marginTop: spacing.xs },
  addBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.charcoal,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  addBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
  // Form modal
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  sheetWrap: { maxHeight: "85%" },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.md,
    paddingBottom: 20,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lightGray,
    alignSelf: "center",
    marginTop: 10,
  },
  sheetTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.charcoal,
    marginVertical: spacing.md,
  },
  fieldWrap: { marginBottom: spacing.sm },
  fieldLabel: { fontSize: 11, letterSpacing: 1, color: colors.warmGray, marginBottom: 4 },
  fieldInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.charcoal,
  },
  formRow: { flexDirection: "row", gap: spacing.sm },
  defaultToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: spacing.md,
  },
  defaultToggleText: { fontSize: 14, color: colors.charcoal },
  saveBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.charcoal,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { color: colors.white, fontSize: 12, letterSpacing: 2 },
});
