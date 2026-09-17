import type {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {radius, spacing, typography} from '../theme';
import {useTheme} from '../context';

// Card wrapper for labeled form fields. Uses boxShadow, not Android elevation.
export type FormFieldCardProps = {
  label: string;
  hint: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

const FormFieldCard = ({
  label,
  hint,
  required = false,
  error,
  children,
}: FormFieldCardProps) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.shadow, {backgroundColor: colors.surface}]}>
      <View style={[styles.card, {backgroundColor: colors.surface}]}>
        <View style={styles.header}>
          <Text style={[styles.label, {color: colors.textSecondary}]}>
            {label}
            {required ? <Text style={{color: colors.primaryLight}}> *</Text> : null}
          </Text>
          <Text style={[styles.hint, {color: colors.primaryLight}]}>{hint}</Text>
        </View>
        {children}
        {error ? <Text style={[styles.error, {color: colors.error}]}>{error}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    borderRadius: radius.md,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 6,
        spreadDistance: 0,
        color: 'rgba(0, 0, 0, 0.08)',
      },
    ],
  },
  card: {
    borderRadius: radius.md,
    overflow: 'hidden',
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  label: {
    ...typography.label,
  },
  hint: {
    ...typography.label,
  },
  error: {
    ...typography.caption,
    marginTop: spacing[2],
  },
});

export default FormFieldCard;
