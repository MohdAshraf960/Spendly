// Reused for title, amount (Rs prefix), and optional note on the expense form.
import {StyleSheet, Text, TextInput, View, type TextInputProps} from 'react-native';
import {
  Ionicons,
  type IoniconsIconName,
} from '@react-native-vector-icons/ionicons/static';
import {radius, sizes, spacing, typography} from '../theme';
import {useTheme} from '../context';
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
  onFocus?: TextInputProps['onFocus'];
  onBlur?: TextInputProps['onBlur'];
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
  onFocus,
  onBlur,
}: ExpenseTitleFieldProps) => {
  const {colors} = useTheme();
  return (
    <FormFieldCard label={label} hint={hint} required={required} error={error}>
      <View
        style={[
          styles.inner,
          {borderColor: error ? colors.error : colors.border},
          multiline && styles.innerMultiline,
        ]}>
        <Ionicons
          name={icon}
          size={sizes.iconSm}
          color={colors.textSecondary}
          style={multiline ? styles.multilineIcon : undefined}
        />
        {prefix ? <Text style={[styles.prefix, {color: colors.text}]}>{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType={multiline ? 'default' : 'done'}
          textAlignVertical={multiline ? 'top' : 'center'}
          underlineColorAndroid={colors.transparent}
          accessibilityLabel={label}
          style={[styles.input, {color: colors.text}, multiline && styles.inputMultiline]}
        />
      </View>
    </FormFieldCard>
  );
};

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: sizes.border,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    gap: spacing[3],
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
  },
  input: {
    ...typography.bodyMedium,
    fontWeight: '600',
    flex: 1,
    padding: 0,
  },
  inputMultiline: {
    minHeight: 72,
  },
});

export default ExpenseTitleField;
