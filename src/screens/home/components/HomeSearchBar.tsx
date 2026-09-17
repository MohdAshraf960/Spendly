// Filter button shows a dot when category or date filters are active.
import {Pressable, StyleSheet, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {TextField} from '../../../shared/components';
import {
  componentTheme,
  radius,
  shadows,
  sizes,
  spacing,
} from '../../../shared/theme';
import {useTheme} from '../../../shared/context';

type HomeSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onFilterPress?: () => void;
  filterActive?: boolean;
};

const HomeSearchBar = ({
  value,
  onChangeText,
  onFilterPress,
  filterActive = false,
}: HomeSearchBarProps) => {
  const {colors} = useTheme();

  return (
    <View style={styles.row}>
      <TextField
        value={value}
        onChangeText={onChangeText}
        placeholder="Search transactions..."
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        containerStyle={styles.field}
        fieldStyle={[styles.input, {borderColor: colors.borderLight}]}
        prefix={
          <Ionicons
            name="search-outline"
            size={sizes.iconSm}
            color={colors.textTertiary}
          />
        }
        suffix={
          value ? (
            <Pressable
              onPress={() => onChangeText('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear search">
              <Ionicons
                name="close-circle"
                size={sizes.iconSm}
                color={colors.textTertiary}
              />
            </Pressable>
          ) : null
        }
      />
      <Pressable
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel="Filter transactions"
        style={[styles.filterButton, {backgroundColor: colors.primary}]}>
        <Ionicons
          name="options-outline"
          size={sizes.iconMd}
          color={colors.white}
        />
        {filterActive ? (
          <View style={[styles.filterDot, {backgroundColor: colors.warning}]} />
        ) : null}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[4],
  },
  field: {
    flex: 1,
  },
  input: {
    borderRadius: componentTheme.input.radius,
  },
  filterButton: {
    width: componentTheme.input.height,
    height: componentTheme.input.height,
    borderRadius: componentTheme.input.radius,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  filterDot: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    width: spacing[2],
    height: spacing[2],
    borderRadius: radius.circle,
  },
});

export default HomeSearchBar;
