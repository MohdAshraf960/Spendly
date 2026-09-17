import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {Button} from '../../../shared/components';
import {colors, radius, sizes, spacing, typography} from '../../../shared/theme';
import {isIncomeCategory} from '../../../shared/data/categories';
import {formatInr} from '../../../shared/utils/formatCurrency';
import {formatExpenseShortDate} from '../../../shared/utils/formatDate';
import type {Expense} from '../../../types';

export type DeleteExpenseSheetProps = {
  expense?: Expense;
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const DeleteExpenseSheet = ({
  expense,
  visible,
  onConfirm,
  onClose,
}: DeleteExpenseSheetProps) => {
  const insets = useSafeAreaInsets();

  if (!expense) {
    return null;
  }

  // Copy switches to Income so delete is not described as a spend change.
  const isIncome = isIncomeCategory(expense.category);
  const recordLabel = isIncome ? 'Income' : 'Expense';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, {paddingBottom: insets.bottom + spacing[4]}]}>
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons
                name="close"
                size={sizes.iconSm}
                color={colors.error}
              />
            </View>
            <Text style={styles.title}>Delete {recordLabel}?</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close">
              <Ionicons
                name="close"
                size={sizes.iconMd}
                color={colors.textTertiary}
              />
            </Pressable>
          </View>
          <Text style={styles.message}>
            Are you sure you want to delete "{expense.title}" (
            {formatInr(expense.amount)})? This will remove the {recordLabel.toLowerCase()}{' '}
            from your offline ledger
            {isIncome
              ? ' and it will no longer count as money received.'
              : ' and update your spending totals.'}
          </Text>
          <View style={styles.meta}>
            <Ionicons
              name="calendar-outline"
              size={sizes.iconXs}
              color={colors.textTertiary}
            />
            <Text style={styles.metaText}>
              Category: {expense.category.name} ·{' '}
              {formatExpenseShortDate(expense.date)}
            </Text>
          </View>
          <Button
            title={`Yes, Delete ${recordLabel}`}
            variant="danger"
            onPress={onConfirm}
            icon={
              <Ionicons
                name="trash-outline"
                size={sizes.iconSm}
                color={colors.white}
              />
            }
            style={styles.deleteButton}
          />
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={`Keep ${recordLabel.toLowerCase()}`}
            style={styles.keepButton}>
            <Text style={styles.keepLabel}>Keep {recordLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: sizes.avatarSm,
    height: sizes.avatarSm,
    borderRadius: radius.circle,
    backgroundColor: colors.errorBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    color: colors.text,
    flex: 1,
    marginHorizontal: spacing[3],
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing[3],
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  metaText: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
  },
  deleteButton: {
    borderRadius: radius.lg,
  },
  keepButton: {
    height: sizes.button,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[3],
  },
  keepLabel: {
    ...typography.button,
    color: colors.text,
  },
});

export default DeleteExpenseSheet;
