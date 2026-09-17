// Logout wipes Realm (user + expenses). Confirm before leaving Home.
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {Button} from '../../../shared/components';
import {radius, sizes, spacing, typography} from '../../../shared/theme';
import {useTheme} from '../../../shared/context';

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
  const {colors} = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + spacing[4],
            },
          ]}>
          <View style={styles.header}>
            <View
              style={[
                styles.iconWrap,
                {backgroundColor: colors.errorBackground},
              ]}>
              <Ionicons
                name="log-out-outline"
                size={sizes.iconSm}
                color={colors.error}
              />
            </View>
            <Text style={[styles.title, {color: colors.text}]}>Log out?</Text>
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
          <Text style={[styles.message, {color: colors.textSecondary}]}>
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
            style={[
              styles.stayButton,
              {backgroundColor: colors.backgroundSecondary},
            ]}>
            <Text style={[styles.stayLabel, {color: colors.text}]}>
              Stay signed in
            </Text>
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
    flex: 1,
    marginHorizontal: spacing[3],
  },
  message: {
    ...typography.bodyMedium,
    marginTop: spacing[3],
    marginBottom: spacing[5],
  },
  logoutButton: {
    borderRadius: radius.lg,
  },
  stayButton: {
    height: sizes.button,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[3],
  },
  stayLabel: {
    ...typography.button,
  },
});

export default LogoutConfirmSheet;
