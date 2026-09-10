import type {ReactNode} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {componentTheme, colors, sizes, spacing, typography} from '../theme';

// Shared action button. Variants come from componentTheme tokens.
export type ButtonVariant = 'primary' | 'outline' | 'danger' | 'warning';

export type ButtonProps = Omit<PressableProps, 'style' | 'disabled'> & {
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
};

const variantColors = {
  primary: componentTheme.button.primary,
  outline: componentTheme.button.outline,
  danger: componentTheme.button.danger,
  warning: componentTheme.button.warning,
} as const;

const Button = ({
  title,
  variant = 'primary',  
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  onPress,
  ...pressableProps
}: ButtonProps) => {
  const palette = disabled
    ? componentTheme.button.disabled
    : variantColors[variant];
  const isOutline = variant === 'outline';

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole="button"
      accessibilityState={{disabled}}
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        {
          backgroundColor: palette.background,
          borderColor: isOutline
            ? disabled
              ? componentTheme.button.disabled.border
              : componentTheme.button.outline.border
            : colors.transparent,
          borderWidth: isOutline ? sizes.border : 0,
          opacity: pressed && !disabled ? 0.85 : 1,
        },
        style,
      ]}>
      <View style={styles.content}>
        {icon && iconPosition === 'left' ? (
          <View style={styles.icon}>{icon}</View>
        ) : null}
        <Text style={[styles.label, {color: palette.text}]}>{title}</Text>
        {icon && iconPosition === 'right' ? (
          <View style={styles.icon}>{icon}</View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: componentTheme.button.height,
    borderRadius: componentTheme.button.radius,
    paddingHorizontal: spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: spacing[1],
  },
  label: {
    ...typography.button,
    textAlign: 'center',
  },
});

export default Button;
