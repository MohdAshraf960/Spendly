// Centered empty/search-miss block with optional action button.
import type {ReactNode} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {radius, sizes, spacing, typography} from '../theme';
import {useTheme} from '../context';
import Button from './Button';

export type EmptyStateProps = {
  icon?: ReactNode;
  image?: ImageSourcePropType;
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const EmptyState = ({
  icon,
  image,
  title,
  description,
  actionTitle,
  onActionPress,
  style,
}: EmptyStateProps) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.container, style]}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : icon ? (
        <View style={[styles.iconWrap, {backgroundColor: colors.successBackground}]}>{icon}</View>
      ) : null}
      <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
      <Text style={[styles.description, {color: colors.textSecondary}]}>{description}</Text>
      {actionTitle && onActionPress ? (
        <Button
          title={actionTitle}
          onPress={onActionPress}
          style={styles.action}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
  },
  iconWrap: {
    width: sizes.avatarLg + spacing[8],
    height: sizes.avatarLg + spacing[8],
    borderRadius: radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  image: {
    width: sizes.avatarLg + spacing[10],
    height: sizes.avatarLg + spacing[10],
    marginBottom: spacing[4],
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
  description: {
    ...typography.bodyMedium,
    textAlign: 'center',
    marginTop: spacing[2],
  },
  action: {
    marginTop: spacing[5],
    alignSelf: 'stretch',
  },
});

export default EmptyState;
