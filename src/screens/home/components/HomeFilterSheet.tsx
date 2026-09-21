// Category + from/end date. Apply commits; Cancel discards draft changes.
import {useEffect, useState} from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {Button, CategoryTile} from '../../../shared/components';
import {CATEGORIES} from '../../../shared/data/categories';
import {layout, radius, sizes, spacing, typography} from '../../../shared/theme';
import {useTheme} from '../../../shared/context';
import {formatExpenseShortDate} from '../../../shared/utils/formatDate';
import {EMPTY_HOME_FILTERS, type HomeFilters} from '../../../types';

type FilterPane = 'category' | 'date';
type DateField = 'fromDate' | 'endDate';

export type HomeFilterSheetProps = {
  visible: boolean;
  filters: HomeFilters;
  onApply: (filters: HomeFilters) => void;
  onClose: () => void;
};

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const isAfterDay = (left: Date, right: Date) =>
  startOfDay(left).getTime() > startOfDay(right).getTime();

const getDateRangeError = (fromDate?: Date, endDate?: Date) => {
  if (fromDate && endDate && isAfterDay(fromDate, endDate)) {
    return 'From date cannot be after end date';
  }
  return undefined;
};

const copyFilters = (value: HomeFilters): HomeFilters => ({
  categoryIds: [...value.categoryIds],
  fromDate: value.fromDate,
  endDate: value.endDate,
});

const HomeFilterSheet = ({
  visible,
  filters,
  onApply,
  onClose,
}: HomeFilterSheetProps) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const [pane, setPane] = useState<FilterPane>('category');
  const [draft, setDraft] = useState<HomeFilters>(copyFilters(filters));
  const [dateField, setDateField] = useState<DateField>();
  const [iosDraft, setIosDraft] = useState(new Date());
  const [dateError, setDateError] = useState<string>();

  useEffect(() => {
    if (visible) {
      setDraft(copyFilters(filters));
      setPane('category');
      setDateError(undefined);
    }
  }, [visible, filters]);

  const openDatePicker = (field: DateField) => {
    setIosDraft(draft[field] ?? new Date());
    setDateField(field);
  };

  const applyDate = (picked: Date) => {
    if (!dateField) {
      return;
    }

    const nextDate = startOfDay(picked);
    const nextFilters = {...draft, [dateField]: nextDate};
    const error =
      dateField === 'fromDate'
        ? getDateRangeError(nextDate, draft.endDate)
        : getDateRangeError(draft.fromDate, nextDate);

    if (error) {
      setDateError(
        dateField === 'fromDate'
          ? 'From date cannot be after end date'
          : 'End date cannot be before from date',
      );
      setDateField(undefined);
      return;
    }

    setDateError(undefined);
    setDraft(nextFilters);
    setDateField(undefined);
  };

  const handleAndroidChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === 'dismissed' || !selectedDate) {
      setDateField(undefined);
      return;
    }
    applyDate(selectedDate);
  };

  const toggleCategory = (categoryId: string) => {
    const selected = draft.categoryIds.includes(categoryId)
      ? draft.categoryIds.filter(id => id !== categoryId)
      : [...draft.categoryIds, categoryId];
    setDraft({...draft, categoryIds: selected});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + spacing[3],
            },
          ]}>
          <View
            style={[
              styles.header,
              {borderBottomColor: colors.borderLight},
            ]}>
            <Text style={[styles.headerTitle, {color: colors.text}]}>
              Filters
            </Text>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => {
                  setDraft(EMPTY_HOME_FILTERS);
                  setDateError(undefined);
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Reset all filters">
                <Text style={[styles.resetLabel, {color: colors.primary}]}>
                  Reset All
                </Text>
              </Pressable>
              <Pressable
                onPress={onClose}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close filters">
                <Ionicons
                  name="close"
                  size={sizes.iconMd}
                  color={colors.text}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.panes}>
            <View
              style={[
                styles.leftPane,
                {
                  backgroundColor: colors.background,
                  borderRightColor: colors.borderLight,
                },
              ]}>
              <Pressable
                onPress={() => setPane('category')}
                style={[
                  styles.paneTab,
                  {
                    borderLeftColor:
                      pane === 'category' ? colors.primary : colors.transparent,
                    backgroundColor:
                      pane === 'category' ? colors.surface : colors.transparent,
                  },
                ]}>
                <Text
                  style={[
                    styles.paneTabLabel,
                    {
                      color:
                        pane === 'category'
                          ? colors.primary
                          : colors.textSecondary,
                    },
                    pane === 'category' && styles.paneTabLabelSelected,
                  ]}>
                  Category
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setPane('date')}
                style={[
                  styles.paneTab,
                  {
                    borderLeftColor:
                      pane === 'date' ? colors.primary : colors.transparent,
                    backgroundColor:
                      pane === 'date' ? colors.surface : colors.transparent,
                  },
                ]}>
                <Text
                  style={[
                    styles.paneTabLabel,
                    {
                      color:
                        pane === 'date'
                          ? colors.primary
                          : colors.textSecondary,
                    },
                    pane === 'date' && styles.paneTabLabelSelected,
                  ]}>
                  Date/Month
                </Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.rightPane}
              contentContainerStyle={styles.rightContent}
              showsVerticalScrollIndicator={false}>
              {pane === 'category'
                ? CATEGORIES.map(category => (
                    <CategoryTile
                      key={category.id}
                      name={category.name}
                      image={category.image}
                      selected={draft.categoryIds.includes(category.id)}
                      onPress={() => toggleCategory(category.id)}
                    />
                  ))
                : (
                    <>
                      <FilterDateRow
                        label="From date"
                        value={draft.fromDate}
                        error={Boolean(dateError)}
                        onPress={() => openDatePicker('fromDate')}
                      />
                      <FilterDateRow
                        label="End date"
                        value={draft.endDate}
                        error={Boolean(dateError)}
                        onPress={() => openDatePicker('endDate')}
                      />
                      {dateError ? (
                        <Text style={[styles.dateError, {color: colors.error}]}>
                          {dateError}
                        </Text>
                      ) : null}
                    </>
                  )}
            </ScrollView>
          </View>
          <View
            style={[
              styles.footer,
              {borderTopColor: colors.borderLight},
            ]}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={styles.footerButton}
            />
            <Button
              title="Apply Filter"
              onPress={() => {
                const error = getDateRangeError(draft.fromDate, draft.endDate);
                if (error) {
                  setPane('date');
                  setDateError(error);
                  return;
                }
                onApply(draft);
              }}
              style={styles.footerButton}
            />
          </View>
        </View>
      </View>

      {dateField && Platform.OS === 'android' ? (
        <DateTimePicker
          value={draft[dateField] ?? new Date()}
          mode="date"
          display="default"
          maximumDate={dateField === 'fromDate' ? draft.endDate : undefined}
          minimumDate={dateField === 'endDate' ? draft.fromDate : undefined}
          onChange={handleAndroidChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={Boolean(dateField)}
          transparent
          animationType="slide"
          onRequestClose={() => setDateField(undefined)}>
          <View style={styles.iosOverlay}>
            <Pressable
              style={styles.backdrop}
              onPress={() => setDateField(undefined)}
            />
            <View style={[styles.iosSheet, {backgroundColor: colors.surface}]}>
              <View style={styles.iosActions}>
                <Pressable onPress={() => setDateField(undefined)}>
                  <Text style={[styles.iosAction, {color: colors.textSecondary}]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable onPress={() => applyDate(iosDraft)}>
                  <Text style={[styles.iosAction, styles.iosDone, {color: colors.primary}]}>
                    Done
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={iosDraft}
                mode="date"
                display="spinner"
                maximumDate={dateField === 'fromDate' ? draft.endDate : undefined}
                minimumDate={dateField === 'endDate' ? draft.fromDate : undefined}
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
    </Modal>
  );
};

const FilterDateRow = ({
  label,
  value,
  error = false,
  onPress,
}: {
  label: string;
  value?: Date;
  error?: boolean;
  onPress: () => void;
}) => {
  const {colors} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.dateRow,
        {borderColor: error ? colors.error : colors.border},
      ]}>
      <Ionicons
        name="calendar-outline"
        size={sizes.iconSm}
        color={colors.primary}
      />
      <View style={styles.dateContent}>
        <Text style={[styles.dateLabel, {color: colors.textTertiary}]}>
          {label}
        </Text>
        <Text style={[styles.dateValue, {color: colors.text}]}>
          {value ? formatExpenseShortDate(value) : 'Select date'}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={sizes.iconSm}
        color={colors.textTertiary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    height: '78%',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: sizes.border,
  },
  headerTitle: {
    ...typography.title,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  resetLabel: {
    ...typography.label,
    fontWeight: '600',
  },
  panes: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPane: {
    width: 128,
    borderRightWidth: sizes.border,
  },
  paneTab: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
    borderLeftWidth: 3,
  },
  paneTabLabel: {
    ...typography.bodyMedium,
  },
  paneTabLabelSelected: {
    fontWeight: '600',
  },
  rightPane: {
    flex: 1,
  },
  rightContent: {
    padding: spacing[3],
    gap: spacing[2],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: sizes.border,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    gap: spacing[3],
  },
  dateError: {
    ...typography.caption,
    marginTop: spacing[1],
  },
  dateContent: {
    flex: 1,
    minWidth: 0,
  },
  dateLabel: {
    ...typography.caption,
  },
  dateValue: {
    ...typography.bodyMedium,
    fontWeight: '600',
    marginTop: spacing[1],
  },
  iosOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
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
  footer: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[3],
    borderTopWidth: sizes.border,
  },
  footerButton: {
    flex: 1,
  },
});

export default HomeFilterSheet;
