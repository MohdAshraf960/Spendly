import {useState} from 'react';
import {Image, Modal, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {radius, sizes, spacing, typography} from '../theme';
import {useTheme} from '../context';
import {formatExpenseDateTitle, formatExpenseTime} from '../utils/formatDate';
import FormFieldCard from './FormFieldCard';

const datePickerIcon = require('../../../assets/categories/date_picker.webp');

// Native date/time picker. Android uses a dialog; iOS uses an inline sheet.
export type DatePickerFieldProps = {
  value: Date;
  onChange: (date: Date) => void;
};

const applyPickedDate = (current: Date, picked: Date) => {
  const next = new Date(current);
  next.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
  return next;
};

const DatePickerField = ({value, onChange}: DatePickerFieldProps) => {
  const {colors} = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [iosDraft, setIosDraft] = useState(value);

  const openPicker = () => {
    setIosDraft(value);
    setShowPicker(true);
  };

  const handleAndroidChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowPicker(false);
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }
    onChange(applyPickedDate(value, selectedDate));
  };

  const confirmIosDate = () => {
    onChange(applyPickedDate(value, iosDraft));
    setShowPicker(false);
  };

  return (
    <>
      <FormFieldCard label="Date & Time" hint="Opens calendar" required>
        <Pressable
          onPress={openPicker}
          accessibilityRole="button"
          accessibilityLabel="Pick date"
          style={[
            styles.inner,
            {
              backgroundColor: colors.transparent,
              borderColor: colors.border,
            },
          ]}>
          <Image
            source={datePickerIcon}
            style={styles.icon}
            resizeMode="contain"
          />
          <View style={styles.content}>
            <Text style={[styles.title, {color: colors.text}]} numberOfLines={1}>
              {formatExpenseDateTitle(value)}
            </Text>
            <Text style={[styles.subtitle, {color: colors.textTertiary}]}>
              Logged at {formatExpenseTime(value)}
            </Text>
          </View>
          <View style={styles.pickButton}>
            <Text style={[styles.pickLabel, {color: colors.primary}]}>
              {'Pick Date'}
            </Text>
          </View>
        </Pressable>
      </FormFieldCard>

      {showPicker && Platform.OS === 'android' ? (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}>
          <View style={styles.iosOverlay}>
            <Pressable
              style={styles.iosBackdrop}
              onPress={() => setShowPicker(false)}
            />
            <View style={[styles.iosSheet, {backgroundColor: colors.surface}]}>
              <View style={styles.iosActions}>
                <Pressable onPress={() => setShowPicker(false)}>
                  <Text style={[styles.iosAction, {color: colors.textSecondary}]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable onPress={confirmIosDate}>
                  <Text style={[styles.iosAction, styles.iosDone, {color: colors.primary}]}>
                    Done
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={iosDraft}
                mode="date"
                display="spinner"
                onChange={(_event, selectedDate) => {
                  if (selectedDate) {
                    setIosDraft(selectedDate);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: sizes.border,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  icon: {
    width: sizes.avatarMd,
    height: sizes.avatarMd,
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: spacing[3],
  },
  title: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.caption,
    marginTop: spacing[1],
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  pickLabel: {
    ...typography.label,
    textAlign: 'left',
  },
  iosOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  iosBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  iosSheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing[6],
  },
  iosActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  iosAction: {
    ...typography.bodyMedium,
  },
  iosDone: {
    fontWeight: '600',
  },
});

export default DatePickerField;
