// Placeholder for a stat card while Realm data is loading.
import {StyleSheet, View} from 'react-native';
import {Shimmer} from '../../../shared/components';
import {colors, radius, spacing} from '../../../shared/theme';

const StatCardShimmer = () => {
  return (
    <View style={styles.card}>
      <Shimmer
        width="56%"
        height={10}
        baseColor="rgba(255, 255, 255, 0.22)"
        highlightColor="rgba(255, 255, 255, 0.55)"
      />
      <Shimmer
        width="74%"
        height={18}
        style={styles.value}
        baseColor="rgba(255, 255, 255, 0.22)"
        highlightColor="rgba(255, 255, 255, 0.55)"
      />
      <Shimmer
        width="48%"
        height={10}
        style={styles.subtitle}
        baseColor="rgba(255, 255, 255, 0.22)"
        highlightColor="rgba(255, 255, 255, 0.55)"
      />
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
  value: {
    marginTop: spacing[2],
  },
  subtitle: {
    marginTop: spacing[2],
  },
});

export default StatCardShimmer;
