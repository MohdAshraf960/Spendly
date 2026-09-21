// Generic input used on Login and Home search. Prefix/suffix are optional.
import {useState, type ReactNode} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import {componentTheme, sizes, spacing, typography} from '../theme';
import {useTheme} from '../context';

export type TextFieldProps = Omit<TextInputProps, 'editable' | 'style'> & {
  label?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  error?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  fieldStyle?: StyleProp<ViewStyle>;
};

const TextField = ({
  label,
  prefix,
  suffix,
  error,
  disabled = false,
  containerStyle,
  fieldStyle,
  onFocus,
  onBlur,
  placeholderTextColor,
  ...inputProps
}: TextFieldProps) => {
  const {colors} = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
    ? colors.borderFocused
    : colors.borderLight;

  return (
    <View style={containerStyle}>
      {label ? <Text style={[styles.label, {color: colors.textSecondary}]}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          {borderColor},
          fieldStyle,
        ]}>
        {prefix ? <View style={styles.affix}>{prefix}</View> : null}
        <TextInput
          {...inputProps}
          editable={!disabled}
          placeholderTextColor={placeholderTextColor ?? colors.textTertiary}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
          underlineColorAndroid={colors.transparent}
          style={[
            styles.input,
            {
              color: disabled
                ? colors.textDisabled
                : colors.text,
            },
          ]}
        />
        {suffix ? <View style={styles.affix}>{suffix}</View> : null}
      </View>
      {error ? <Text style={[styles.error, {color: colors.error}]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    marginBottom: spacing[1],
  },
  field: {
    minHeight: componentTheme.input.height,
    borderWidth: sizes.border,
    borderRadius: componentTheme.input.radius,
    paddingHorizontal: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  affix: {
    marginHorizontal: spacing[1],
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    ...typography.body,
    flex: 1,
    paddingVertical: spacing[2],
    backgroundColor: 'transparent',
  },
  error: {
    ...typography.caption,
    marginTop: spacing[1],
  },
});

export default TextField;
