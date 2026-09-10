// Skeleton rows that match the transaction tile layout.
import {StyleSheet, View} from 'react-native';
import {Shimmer} from '../../../shared/components';
import {colors, radius, sizes, spacing} from '../../../shared/theme';

type ExpenseListShimmerProps = {
  rows?: number;
};

const ExpenseListShimmer = ({rows = 6}: ExpenseListShimmerProps) => {
  return (
    <View style={styles.list}>
      {Array.from({length: rows}, (_, index) => (
        <View key={index} style={styles.row}>
          <Shimmer
            width={sizes.avatarMd}
            height={sizes.avatarMd}
            borderRadius={radius.circle}
          />
          <View style={styles.content}>
            <Shimmer width="68%" height={14} />
            <Shimmer width="42%" height={10} style={styles.date} />
          </View>
          <Shimmer
            width={sizes.iconSm}
            height={sizes.iconSm}
            borderRadius={radius.xs}
            style={styles.action}
          />
          <Shimmer
            width={sizes.iconSm}
            height={sizes.iconSm}
            borderRadius={radius.xs}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing[2],
    marginTop: spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: spacing[3],
  },
  date: {
    marginTop: spacing[2],
  },
  action: {
    marginRight: spacing[2],
  },
});

export default ExpenseListShimmer;
