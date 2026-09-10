import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {colors, radius, sizes, spacing, typography} from '../theme';
import Button from './Button';

// Save result sheet. Success closes the form; error stays so the user can retry.
export type FeedbackDialogVariant = 'success' | 'error';

export type FeedbackDialogProps = {
  visible: boolean;
  variant: FeedbackDialogVariant;
  title: string;
  message: string;
  actionTitle?: string;
  onClose: () => void;
};

const variantTheme = {
  success: {
    icon: 'checkmark' as const,
    iconColor: colors.success,
    iconBackground: colors.successBackground,
  },
  error: {
    icon: 'close' as const,
    iconColor: colors.error,
    iconBackground: colors.errorBackground,
  },
};

const FeedbackDialog = ({
  visible,
  variant,
  title,
  message,
  actionTitle = 'OK',
  onClose,
}: FeedbackDialogProps) => {
  const insets = useSafeAreaInsets();
  const theme = variantTheme[variant];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, {paddingBottom: insets.bottom + spacing[4]}]}>
          <View style={styles.header}>
            <View
              style={[styles.iconWrap, {backgroundColor: theme.iconBackground}]}>
              <Ionicons
                name={theme.icon}
                size={sizes.iconSm}
                color={theme.iconColor}
              />
            </View>
            <Text style={styles.title}>{title}</Text>
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
          <Text style={styles.message}>{message}</Text>
          <Button
            title={actionTitle}
            variant={variant === 'error' ? 'danger' : 'primary'}
            onPress={onClose}
            style={styles.action}
          />
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
    backgroundColor: colors.surface,
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
    color: colors.text,
    flex: 1,
    marginHorizontal: spacing[3],
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing[3],
    marginBottom: spacing[5],
  },
  action: {
    borderRadius: radius.lg,
  },
});

export default FeedbackDialog;
