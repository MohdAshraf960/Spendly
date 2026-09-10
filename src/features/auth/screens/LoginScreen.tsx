import {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import type {RootStackScreenProps} from '../../../app/navigation/types';
import {Button, FeedbackDialog, TextField} from '../../../shared/components';
import {usePageStyle} from '../../../shared/hooks';
import {
  colors,
  layout,
  radius,
  shadows,
  sizes,
  spacing,
  typography,
} from '../../../shared/theme';
import {useLogin} from '../hooks';
import {validateEmail, validatePassword} from '../validation/validateLogin';

const splashIcon = require('../../../../assets/icons/splash_icon.png');

// Email + password create or restore the local session, then open Home.
const LoginScreen = ({navigation}: RootStackScreenProps<'Login'>) => {
  const pageStyle = usePageStyle();
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const {login, saving} = useLogin();

  const showEmailError = (value: string) => {
    const nextError = validateEmail(value);
    setEmailError(nextError);
    return nextError;
  };

  const showPasswordError = (value: string) => {
    const nextError = validatePassword(value);
    setPasswordError(nextError);
    return nextError;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (submitted || emailError) {
      showEmailError(value);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (submitted || passwordError) {
      showPasswordError(value);
    }
  };

  const handleContinue = () => {
    setSubmitted(true);
    const nextEmailError = showEmailError(email);
    const nextPasswordError = showPasswordError(password);
    if (nextEmailError || nextPasswordError) {
      return;
    }

    try {
      login({email, password});
      navigation.replace('Home');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while signing in. Please try again.',
      );
    }
  };

  const canContinue = Boolean(email.trim() && password) && !saving;

  // Android does not adjust for the keyboard; extra bottom padding is added instead.
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, event => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <View style={[pageStyle.page, styles.page]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={insets.top}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom:
                spacing[8] +
                (Platform.OS === 'android' ? keyboardHeight : insets.bottom),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.logoWrap}>
              <Image
                source={splashIcon}
                style={styles.logo}
                resizeMode="contain"
                accessibilityLabel="Spendly"
              />
            </View>
            <Text style={styles.title}>Track your money. Simply.</Text>
            <Text style={styles.subtitle}>
              Enter your email and password to sign in or get started.
            </Text>
          </View>

          <View style={styles.card}>
            <TextField
              label="Email address"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => showEmailError(email)}
              error={emailError}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              prefix={
                <Ionicons
                  name="mail-outline"
                  size={sizes.iconSm}
                  color={emailError ? colors.error : colors.textTertiary}
                />
              }
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => showPasswordError(password)}
              error={passwordError}
              placeholder="Enter your password"
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              prefix={
                <Ionicons
                  name="lock-closed-outline"
                  size={sizes.iconSm}
                  color={passwordError ? colors.error : colors.textTertiary}
                />
              }
              suffix={
                <Pressable
                  onPress={() => setPasswordVisible(visible => !visible)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={
                    passwordVisible ? 'Hide password' : 'Show password'
                  }>
                  <Ionicons
                    name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={sizes.iconSm}
                    color={colors.textTertiary}
                  />
                </Pressable>
              }
            />
            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!canContinue}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  page: {
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[8],
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  logo: {
    width: 56,
    height: 56,
  },
  title: {
    ...typography.heading2,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing[5],
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing[5],
    gap: spacing[5],
    ...shadows.medium,
  },
});

export default LoginScreen;
