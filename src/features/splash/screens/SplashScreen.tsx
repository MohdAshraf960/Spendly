import {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {RootStackScreenProps} from '../../../app/navigation/types';
import {userRepository} from '../../auth';
import {usePageStyle} from '../../../shared/hooks';
import {colors, spacing, typography} from '../../../shared/theme';

const splashIcon = require('../../../../assets/icons/splash_icon.png');

// Brief brand hold, then skip Login if a local session already exists.
const SplashScreen = ({navigation}: RootStackScreenProps<'Splash'>) => {
  const pageStyle = usePageStyle();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace(userRepository.getCurrent() ? 'Home' : 'Login');
    }, 2000);

    return () => clearTimeout(timeout);
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
