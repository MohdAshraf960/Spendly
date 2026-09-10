// Reused for title, amount (₹ prefix), and optional note on the expense form.
import {StyleSheet, Text, TextInput, View, type TextInputProps} from 'react-native';
import {
  Ionicons,
  type IoniconsIconName,
} from '@react-native-vector-icons/ionicons/static';
import {colors, radius, sizes, spacing, typography} from '../theme';
import FormFieldCard from './FormFieldCard';

export type ExpenseTitleFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  hint?: string;
  required?: boolean;
  icon?: IoniconsIconName;
  placeholder?: string;
  prefix?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  multiline?: boolean;
  maxLength?: number;
  error?: string;
};

const ExpenseTitleField = ({
  value,
  onChangeText,
  label = 'Expense Title',
  hint = 'REQUIRED',
  required = true,
  icon = 'pencil-outline',
  placeholder = 'Expense title',
  prefix,
  keyboardType = 'default',
  autoCapitalize = 'words',
  multiline = false,
  maxLength,
  error,
}: ExpenseTitleFieldProps) => {
  return (
    <FormFieldCard label={label} hint={hint} required={required} error={error}>
      <View
        style={[
          styles.inner,
          multiline && styles.innerMultiline,
          error ? styles.innerError : null,
        ]}>
        <Ionicons
          name={icon}
          size={sizes.iconSm}
          color={colors.textSecondary}
          style={multiline ? styles.multilineIcon : undefined}
        />
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          returnKeyType={multiline ? 'default' : 'done'}
          textAlignVertical={multiline ? 'top' : 'center'}
          underlineColorAndroid={colors.transparent}
          accessibilityLabel={label}
          style={[styles.input, multiline && styles.inputMultiline]}
        />
      </View>
    </FormFieldCard>
  );
};

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.transparent,
    borderWidth: sizes.border,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    gap: spacing[3],
  },
  innerError: {
    borderColor: colors.error,
  },
  innerMultiline: {
    alignItems: 'flex-start',
  },
  multilineIcon: {
    marginTop: spacing[1],
  },
  prefix: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    padding: 0,
  },
  inputMultiline: {
    minHeight: 72,
  },
});

export default ExpenseTitleField;
