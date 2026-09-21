// One overview metric inside the green summary panel.
import {StyleSheet, Text, View} from 'react-native';
import {radius, spacing, typography} from '../../../shared/theme';
import {useTheme} from '../../../shared/context';

type StatCardProps = {
  label: string;
  value: string;
  subtitle: string;
};

const StatCard = ({label, value, subtitle}: StatCardProps) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.card, {backgroundColor: colors.primaryLight}]}>
      <Text style={[styles.label, {color: colors.white}]} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[styles.value, {color: colors.white}]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={[styles.subtitle, {color: colors.white}]} numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
  },
  label: {
    ...typography.caption,
  },
  value: {
    ...typography.title,
    marginTop: spacing[1],
  },
  subtitle: {
    ...typography.caption,
    marginTop: spacing[1],
  },
});

export default StatCard;
