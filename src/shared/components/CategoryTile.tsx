// Selectable category cell used in the picker and Home filters.
import type {ReactNode} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {colors, radius, sizes, spacing, typography} from '../theme';

export type CategoryTileProps = {
  name: string;
  icon?: ReactNode;
  image?: ImageSourcePropType;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const CategoryTile = ({
  name,
  
  icon,
  image,
  selected = false,
  onPress,
  style,
}: CategoryTileProps) => {

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{selected}}
      accessibilityLabel={name}
      style={[
        styles.tile,
        selected ? styles.tileSelected : styles.tileUnselected,
        style,
      ]}>
      <View
        style={[
          styles.iconWrap,
        ]}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="contain" />
        ) : (
          icon
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </View>
      <View style={[styles.radio, selected ? styles.radioSelected : styles.radioUnselected]}>
        {selected ? (
          <Ionicons
            name="checkmark"
            size={sizes.iconXs}
            color={colors.textOnPrimary}
          />
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  tileSelected: {
    backgroundColor: colors.successBackground,
  },
  tileUnselected: {
    backgroundColor: colors.surface,
    borderWidth: sizes.border,
    borderColor: colors.borderLight,
  },
  iconWrap: {
    width: sizes.avatarMd,
    height: sizes.avatarMd,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
 
  image: {
    width: sizes.avatarMd,
    height: sizes.avatarMd,
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
  meta: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing[1],
  },
  radio: {
    width: sizes.iconMd,
    height: sizes.iconMd,
    borderRadius: radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: colors.primary,
  },
  radioUnselected: {
    borderWidth: sizes.border,
    borderColor: colors.border,
    backgroundColor: colors.transparent,
  },
});

export default CategoryTile;
