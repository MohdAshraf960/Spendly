// One overview metric inside the green summary panel.
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing, typography} from '../../../shared/theme';

type StatCardProps = {
  label: string;
  value: string;
  subtitle: string;
};

const StatCard = ({label, value, subtitle}: StatCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
  },
  label: {
    ...typography.caption,
    color: colors.white,
  },
  value: {
    ...typography.title,
    color: colors.white,
    marginTop: spacing[1],
  },
  subtitle: {
    ...typography.caption,
    color: colors.white,
    marginTop: spacing[1],
  },
});

export default StatCard;
