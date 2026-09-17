import {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import type {RootStackScreenProps} from '../../../navigation/types';
import {useGoogleSignIn, usePageStyle} from '../../../hooks';
import {FeedbackDialog} from '../../../shared/components';
import {
  componentTheme,
  layout,
  radius,
  shadows,
  sizes,
  spacing,
  typography,
} from '../../../shared/theme';
import {useTheme} from '../../../shared/context';

const splashIcon = require('../../../../assets/icons/splash_icon.webp');

// Google-only sign-in. Creates the local session, then opens Home.
const LoginScreen = ({navigation}: RootStackScreenProps<'Login'>) => {
  const pageStyle = usePageStyle();
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const [errorMessage, setErrorMessage] = useState<string>();
  const {signInWithGoogle, signing} = useGoogleSignIn();

  const handleGoogleContinue = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigation.replace('Home');
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while signing in with Google. Please try again.',
      );
    }
  };

  return (
    <View
      style={[
        pageStyle.page,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom + spacing[8],
        },
      ]}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={[styles.logoWrap, {backgroundColor: colors.surface}]}>
            <Image
              source={splashIcon}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Spendly"
            />
            <View
              style={[
                styles.logoBadge,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.background,
                },
              ]}>
              <Ionicons name="flash" size={10} color={colors.white} />
            </View>
          </View>
          <Text style={[styles.title, {color: colors.text}]}>
            Track your money. Simply.
          </Text>
          <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
            Sign in with Google to access your offline vault.
          </Text>
        </View>

        <View style={[styles.card, {backgroundColor: colors.surface}]}>
          <Pressable
            onPress={handleGoogleContinue}
            disabled={signing}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            accessibilityState={{disabled: signing}}
            style={({pressed}) => [
              styles.googleButton,
              {
                borderColor: colors.border,
                backgroundColor:
                  pressed && !signing
                    ? colors.backgroundSecondary
                    : colors.surface,
              },
              signing && styles.googleButtonDisabled,
            ]}>
            {signing ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <Ionicons
                  name="logo-google"
                  size={sizes.iconMd}
                  color="#4285F4"
                  style={styles.googleIcon}
                />
                <Text style={[styles.googleLabel, {color: colors.text}]}>
                  Continue with Google
                </Text>
              </>
            )}
          </Pressable>
          <Text style={[styles.footnote, {color: colors.textTertiary}]}>
            Fast, secure, and encrypted with your local device.
          </Text>
        </View>
      </View>
      <FeedbackDialog
        visible={Boolean(errorMessage)}
        variant="error"
        title="Couldn’t sign in"
        message={errorMessage ?? ''}
        actionTitle="Try Again"
        onClose={() => setErrorMessage(undefined)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  logo: {
    width: 56,
    height: 56,
  },
  logoBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  title: {
    ...typography.heading2,
    textAlign: 'center',
    marginTop: spacing[5],
  },
  subtitle: {
    ...typography.bodyMedium,
    textAlign: 'center',
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing[5],
    gap: spacing[4],
    ...shadows.medium,
  },
  googleButton: {
    height: componentTheme.button.height,
    borderRadius: componentTheme.button.radius,
    borderWidth: sizes.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    marginRight: spacing[2],
  },
  googleLabel: {
    ...typography.button,
  },
  footnote: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
});

export default LoginScreen;
