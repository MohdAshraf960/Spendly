import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {Button} from '../../../shared/components';
import {radius, sizes, spacing, typography} from '../../../shared/theme';
import {useTheme} from '../../../shared/context';
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
  const {colors} = useTheme();

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
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + spacing[4],
            },
          ]}>
          <View style={styles.header}>
            <View
              style={[
                styles.iconWrap,
                {backgroundColor: colors.errorBackground},
              ]}>
              <Ionicons
                name="close"
                size={sizes.iconSm}
                color={colors.error}
              />
            </View>
            <Text style={[styles.title, {color: colors.text}]}>
              Delete {recordLabel}?
            </Text>
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
          <Text style={[styles.message, {color: colors.textSecondary}]}>
            Are you sure you want to delete "{expense.title}" (
            {formatInr(expense.amount)})? This will remove the {recordLabel.toLowerCase()}{' '}
            from your offline ledger
            {isIncome
              ? ' and it will no longer count as money received.'
              : ' and update your spending totals.'}
          </Text>
          <View
            style={[
              styles.meta,
              {backgroundColor: colors.background},
            ]}>
            <Ionicons
              name="calendar-outline"
              size={sizes.iconXs}
              color={colors.textTertiary}
            />
            <Text style={[styles.metaText, {color: colors.textTertiary}]}>
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
            style={[
              styles.keepButton,
              {backgroundColor: colors.backgroundSecondary},
            ]}>
            <Text style={[styles.keepLabel, {color: colors.text}]}>
              Keep {recordLabel}
            </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    flex: 1,
    marginHorizontal: spacing[3],
  },
  message: {
    ...typography.bodyMedium,
    marginTop: spacing[3],
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  metaText: {
    ...typography.caption,
    flex: 1,
  },
  deleteButton: {
    borderRadius: radius.lg,
  },
  keepButton: {
    height: sizes.button,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[3],
  },
  keepLabel: {
    ...typography.button,
  },
});

export default DeleteExpenseSheet;
