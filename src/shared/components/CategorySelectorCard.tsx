// Closed state of the category picker. Opens the sheet when pressed.
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {colors, radius, sizes, spacing, typography} from '../theme';
import type {Category} from '../data/categories';
import FormFieldCard from './FormFieldCard';

export type CategorySelectorCardProps = {
  category?: Category;
  onChangePress: () => void;
  error?: string;
};

const CategorySelectorCard = ({
  category,
  onChangePress,
  error,
}: CategorySelectorCardProps) => {
  return (
    <FormFieldCard
      label="Category"
      hint="Tapping opens selector"
      required
      error={error}>
      <Pressable
        onPress={onChangePress}
        accessibilityRole="button"
        accessibilityLabel={category ? 'Change category' : 'Select category'}
        style={[styles.inner, error ? styles.innerError : null]}>
        {category ? (
          <Image
            source={category.image}
            style={styles.icon}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderIcon}>
            <Ionicons
              name="pricetag-outline"
              size={sizes.iconSm}
              color={colors.primary}
            />
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {category?.name ?? 'Select category'}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {category?.description ?? 'Choose one category'}
          </Text>
        </View>
        <View style={styles.changeButton}>
          <Text style={styles.changeLabel}>
            {category ? 'Change' : 'Select'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={sizes.iconXs}
            color={colors.primaryLight}
          />
        </View>
      </Pressable>
    </FormFieldCard>
  );
};

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.transparent,
    borderWidth: sizes.border,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  innerError: {
    borderColor: colors.error,
  },
  icon: {
    width: sizes.avatarMd,
    height: sizes.avatarMd,
  },
  placeholderIcon: {
    width: sizes.avatarMd,
    height: sizes.avatarMd,
    borderRadius: radius.circle,
    backgroundColor: colors.successBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: spacing[3],
  },
  name: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing[1],
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  changeLabel: {
    ...typography.label,
    color: colors.primaryLight,
  },
});

export default CategorySelectorCard;
