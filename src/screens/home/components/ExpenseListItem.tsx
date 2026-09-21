import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {radius, sizes, spacing, typography} from '../../../shared/theme';
import {useTheme} from '../../../shared/context';
import {getCategoryImage, isIncomeCategory} from '../../../shared/data/categories';
import {formatInrCompact} from '../../../shared/utils/formatCurrency';
import {formatExpenseShortDate} from '../../../shared/utils/formatDate';
import type {Expense} from '../../../types';

type ExpenseListItemProps = {
  expense: Expense;
  onPress: () => void;
  onDeletePress: () => void;
};

const ExpenseListItem = ({
  expense,
  onPress,
  onDeletePress,
}: ExpenseListItemProps) => {
  const {colors} = useTheme();
  // Income: green +amount. Expense: red -amount. Compact after 3+ digits.
  const isIncome = isIncomeCategory(expense.category);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${isIncome ? 'Income' : 'Expense'} ${expense.title}`}
      style={[styles.row, {backgroundColor: colors.surface}]}>
      <Image
        source={getCategoryImage(expense.category)}
        style={styles.icon}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]} numberOfLines={1}>
          {expense.title}
        </Text>
        <Text style={[styles.date, {color: colors.textTertiary}]} numberOfLines={1}>
          {formatExpenseShortDate(expense.date)}
        </Text>
      </View>
      <Text
        style={[
          styles.amount,
          {color: isIncome ? colors.success : colors.error},
        ]}>
        {`${isIncome ? '+' : '-'}${formatInrCompact(expense.amount)}`}
      </Text>
      <Pressable
        onPress={onDeletePress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${expense.title}`}
        style={styles.deleteButton}>
        <Ionicons
          name="trash-outline"
          size={sizes.iconSm}
          color={colors.error}
        />
      </Pressable>
      <Ionicons
        name="chevron-forward"
        size={sizes.iconSm}
        color={colors.textTertiary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  icon: {
    width: sizes.avatarMd,
    height: sizes.avatarMd,
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: spacing[3],
  },
  title: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  date: {
    ...typography.caption,
    marginTop: spacing[1],
  },
  amount: {
    ...typography.bodyMedium,
    fontWeight: '600',
    marginRight: spacing[2],
    flexShrink: 0,
  },
  deleteButton: {
    padding: spacing[1],
    marginRight: spacing[1],
  },
});

export default ExpenseListItem;
