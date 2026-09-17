import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Button,
  CategoryPicker,
  DatePickerField,
  ExpenseTitleField,
  FeedbackDialog,
  type FeedbackDialogVariant,
} from '../../../shared/components';
import {usePageStyle} from '../../../hooks';
import {layout, spacing} from '../../../shared/theme';
import {useTheme} from '../../../shared/context';
import {isIncomeCategory, type Category} from '../../../shared/data/categories';
import {formatInr} from '../../../shared/utils/formatCurrency';
import {
  hasAddExpenseErrors,
  validateAddExpense,
  type AddExpenseErrors,
} from '../../../validation';

export type ExpenseFormValues = {
  title: string;
  amount: number;
  category: Category;
  date: Date;
  note: string;
};

export type ExpenseFormProps = {
  mode?: 'add' | 'edit';
  initialTitle?: string;
  initialAmount?: string;
  initialCategory?: Category;
  initialDate?: Date;
  initialNote?: string;
  saving?: boolean;
  onCancel: () => void;
  onSaved: () => void;
  onSubmit: (values: ExpenseFormValues) => void;
};

type FeedbackState = {
  variant: FeedbackDialogVariant;
  title: string;
  message: string;
};

// Digits and one decimal only; at most two places after the point.
const sanitizeAmount = (text: string) => {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const [whole, ...decimals] = cleaned.split('.');
  if (decimals.length === 0) {
    return whole;
  }
  return `${whole}.${decimals.join('').slice(0, 2)}`;
};

// Shared add/edit form. Labels and header change when Income is selected.
const ExpenseForm = ({
  mode = 'add',
  initialTitle = '',
  initialAmount = '',
  initialCategory,
  initialDate,
  initialNote = '',
  saving = false,
  onCancel,
  onSaved,
  onSubmit,
}: ExpenseFormProps) => {
  const pageStyle = usePageStyle();
  const {colors} = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<any>(null);
  const noteY = useRef(0);
  const noteHeight = useRef(0);
  const scrollViewHeight = useRef(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [noteFocused, setNoteFocused] = useState(false);
  const [category, setCategory] = useState<Category | undefined>(
    initialCategory,
  );
  const [expenseDate, setExpenseDate] = useState(initialDate ?? new Date());
  const [title, setTitle] = useState(initialTitle);
  const [amount, setAmount] = useState(initialAmount);
  const [note, setNote] = useState(initialNote);
  const [errors, setErrors] = useState<AddExpenseErrors>({});
  const [feedback, setFeedback] = useState<FeedbackState>();
  const isIncome = isIncomeCategory(category);
  const recordLabel = isIncome ? 'income' : 'expense';

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        mode === 'edit'
          ? isIncome
            ? 'Edit Income'
            : 'Edit Expense'
          : isIncome
            ? 'Add Income'
            : 'Add Expense',
    });
  }, [isIncome, mode, navigation]);

  // Android adjustResize still leaves the last field under the pinned footer.
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

  const scrollNoteIntoView = () => {
    const visibleHeight = scrollViewHeight.current;
    if (!visibleHeight) {
      return;
    }

    const fieldBottom = noteY.current + noteHeight.current;
    const target = fieldBottom - visibleHeight + spacing[4];
    scrollRef.current?.scrollTo({
      y: Math.max(0, target),
      animated: true,
    });
  };

  useEffect(() => {
    if (!noteFocused) {
      return;
    }

    const timeout = setTimeout(scrollNoteIntoView, 80);
    return () => clearTimeout(timeout);
  }, [keyboardHeight, noteFocused]);

  const clearError = (field: keyof AddExpenseErrors) => {
    if (errors[field]) {
      setErrors(current => ({...current, [field]: undefined}));
    }
  };

  const handleSave = () => {
    const nextErrors = validateAddExpense({title, amount, category});
    setErrors(nextErrors);

    if (hasAddExpenseErrors(nextErrors) || !category) {
      const details = Object.values(nextErrors).filter(Boolean).join(' ');
      setFeedback({
        variant: 'error',
        title: `Couldn’t save ${recordLabel}`,
        message:
          details ||
          'Please fill all required fields and try again.',
      });
      return;
    }

    const values = {
      title: title.trim(),
      amount: Number(amount),
      category,
      date: expenseDate,
      note: note.trim(),
    };

    try {
      onSubmit(values);
      setFeedback({
        variant: 'success',
        title:
          mode === 'edit'
            ? 'Changes saved'
            : isIncome
              ? 'Income saved'
              : 'Expense saved',
        message:
          mode === 'edit'
            ? `"${values.title}" (${formatInr(values.amount)}) was updated in your offline ledger.`
            : isIncome
              ? `"${values.title}" (${formatInr(values.amount)}) was added as income.`
              : `"${values.title}" (${formatInr(values.amount)}) was added to your offline ledger.`,
      });
    } catch (error) {
      setFeedback({
        variant: 'error',
        title: `Couldn’t save ${recordLabel}`,
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong while saving. Please try again.',
      });
    }
  };

  const handleFeedbackClose = () => {
    const wasSuccess = feedback?.variant === 'success';
    setFeedback(undefined);
    if (wasSuccess) {
      onSaved();
    }
  };

  return (
    <View style={[pageStyle.page, {backgroundColor: colors.background}]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={layout.headerHeight + insets.top}>
        <ScrollView
          ref={scrollRef}
          onLayout={event => {
            scrollViewHeight.current = event.nativeEvent.layout.height;
          }}
          contentContainerStyle={[
            pageStyle.content,
            styles.content,
            {
              paddingBottom:
                spacing[4] + (keyboardHeight > 0 ? spacing[6] : 0),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          <ExpenseTitleField
            label={isIncome ? 'Income Title' : 'Expense Title'}
            placeholder={isIncome ? 'Income title' : 'Expense title'}
            value={title}
            error={errors.title}
            onChangeText={text => {
              setTitle(text);
              clearError('title');
            }}
          />
          <ExpenseTitleField
            label={isIncome ? 'Income Amount' : 'Expense Amount'}
            hint="REQUIRED"
            icon="cash-outline"
            prefix="₹"
            placeholder="0.00"
            keyboardType="decimal-pad"
            autoCapitalize="none"
            value={amount}
            error={errors.amount}
            onChangeText={text => {
              setAmount(sanitizeAmount(text));
              clearError('amount');
            }}
          />
          <CategoryPicker
            selectedCategory={category}
            error={errors.category}
            onSelect={selected => {
              setCategory(selected);
              clearError('category');
            }}
          />
          <DatePickerField value={expenseDate} onChange={setExpenseDate} />
          <View
            onLayout={event => {
              noteY.current = event.nativeEvent.layout.y;
              noteHeight.current = event.nativeEvent.layout.height;
            }}>
            <ExpenseTitleField
              label="Personal Note"
              hint="OPTIONAL"
              required={false}
              icon="document-text-outline"
              placeholder="Add a note"
              autoCapitalize="sentences"
              multiline
              value={note}
              onChangeText={setNote}
              onFocus={() => setNoteFocused(true)}
              onBlur={() => setNoteFocused(false)}
            />
          </View>
        </ScrollView>
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              paddingBottom: Math.max(insets.bottom, spacing[4]),
            },
          ]}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            style={styles.footerButton}
          />
          <Button
            title="Save Changes"
            onPress={handleSave}
            disabled={saving}
            style={styles.footerButton}
          />
        </View>
      </KeyboardAvoidingView>
      <FeedbackDialog
        visible={Boolean(feedback)}
        variant={feedback?.variant ?? 'success'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        actionTitle={feedback?.variant === 'error' ? 'Try Again' : 'OK'}
        onClose={handleFeedbackClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[4],
  },
  footer: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[3],
  },
  footerButton: {
    flex: 1,
  },
});

export default ExpenseForm;
