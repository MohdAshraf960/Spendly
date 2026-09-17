// Logout wipes Realm (user + expenses). Confirm before leaving Home.
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {Button} from '../../../shared/components';
import {colors, radius, sizes, spacing, typography} from '../../../shared/theme';

export type LogoutConfirmSheetProps = {
  visible: boolean;
  email?: string;
  onConfirm: () => void;
  onClose: () => void;
};

const LogoutConfirmSheet = ({
  visible,
  email,
  onConfirm,
  onClose,
}: LogoutConfirmSheetProps) => {
  const insets = useSafeAreaInsets();

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
            <View style={styles.iconWrap}>
              <Ionicons
                name="log-out-outline"
                size={sizes.iconSm}
                color={colors.error}
              />
            </View>
            <Text style={styles.title}>Log out?</Text>
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
          <Text style={styles.message}>
            {email
              ? `Are you sure you want to log out of "${email}"? This will clear your offline ledger and signed-in account from this device.`
              : 'Are you sure you want to log out? This will clear your offline ledger and signed-in account from this device.'}
          </Text>
          <Button
            title="Yes, Log out"
            variant="danger"
            onPress={onConfirm}
            icon={
              <Ionicons
                name="log-out-outline"
                size={sizes.iconSm}
                color={colors.white}
              />
            }
            style={styles.logoutButton}
          />
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Stay signed in"
            style={styles.stayButton}>
            <Text style={styles.stayLabel}>Stay signed in</Text>
          </Pressable>
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
    backgroundColor: colors.errorBackground,
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
  logoutButton: {
    borderRadius: radius.lg,
  },
  stayButton: {
    height: sizes.button,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[3],
  },
  stayLabel: {
    ...typography.button,
    color: colors.text,
  },
});

export default LogoutConfirmSheet;
