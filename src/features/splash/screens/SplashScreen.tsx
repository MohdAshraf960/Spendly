import {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '../../../app/navigation/types';
import {refreshGoogleSession, userRepository} from '../../auth';
import {usePageStyle} from '../../../shared/hooks';
import {colors, spacing, typography} from '../../../shared/theme';

const splashIcon = require('../../../../assets/icons/splash_icon.webp');
const MIN_BRAND_HOLD_MS = 1600;

// Brief brand hold, then skip Login if a local session already exists.
// Google sessions are silently refreshed here so the stored token stays valid.
const SplashScreen = ({navigation}: RootStackScreenProps<'Splash'>) => {
  const pageStyle = usePageStyle();

  useEffect(() => {
    let cancelled = false;
    const minHold = new Promise<void>(resolve =>
      setTimeout(() => resolve(), MIN_BRAND_HOLD_MS),
    );

    const refresh = async () => {
      const current = userRepository.getCurrent();
      if (current?.provider !== 'google') {
        return;
      }
      const profile = await refreshGoogleSession();
      if (profile) {
        userRepository.updateSessionTokens(profile.idToken);
      }
    };

    Promise.all([minHold, refresh().catch(() => undefined)]).then(() => {
      if (cancelled) {
        return;
      }
      navigation.replace(userRepository.getCurrent() ? 'Home' : 'Login');
    });

    return () => {
      cancelled = true;
    };
  }, [navigation]);

  return (
    <View style={[pageStyle.page, styles.container]}>
      <Image
        source={splashIcon}
        style={styles.icon}
        resizeMode="contain"
        accessibilityLabel="Spendly"
      />
      <Text style={styles.appName}>Spendly</Text>
      <Text style={styles.tagline}>
        Understand your spending.{'\n'}Take absolute control.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  icon: {
    width: 120,
    height: 120,
  },
  appName: {
    ...typography.display,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing[4],
  },
  tagline: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[2],
  },
});

export default SplashScreen;
