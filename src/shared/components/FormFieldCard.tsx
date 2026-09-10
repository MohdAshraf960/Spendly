import type {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';

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
  return (
    <View style={styles.shadow}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.label}>
            {label}
            {required ? <Text style={styles.asterisk}> *</Text> : null}
          </Text>
          <Text style={styles.hint}>{hint}</Text>
        </View>
        {children}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.surface,
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
    color: colors.textSecondary,
  },
  asterisk: {
    color: colors.primaryLight,
  },
  hint: {
    ...typography.label,
    color: colors.primaryLight,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing[2],
  },
});

export default FormFieldCard;
