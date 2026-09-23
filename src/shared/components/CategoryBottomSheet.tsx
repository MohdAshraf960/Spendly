import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {radius, spacing, typography} from '../theme';
import {useTheme} from '../context';
import {CATEGORIES, type Category} from '../data/categories';
import CategoryTile from './CategoryTile';

// Full category grid. Selecting a tile closes the sheet and returns the object.
export type CategoryBottomSheetProps = {
  visible: boolean;
  selectedId?: string;
  onSelect: (category: Category) => void;
  onClose: () => void;
};

const CategoryBottomSheet = ({
  visible,
  selectedId,
  onSelect,
  onClose,
}: CategoryBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss category picker"
          style={styles.backdrop}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + spacing[4],
            },
          ]}>
          <View style={[styles.handle, {backgroundColor: colors.borderLight}]} />
          <Text style={[styles.title, {color: colors.text}]}>Select category</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}>
            {CATEGORIES.map(category => (
              <CategoryTile
                key={category.id}
                name={category.name}
                image={category.image}
                selected={category.id === selectedId}
                onPress={() => {
                  onSelect(category);
                  onClose();
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
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
    maxHeight: '72%',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    marginBottom: spacing[4],
  },
  title: {
    ...typography.title,
    marginBottom: spacing[3],
  },
  list: {
    gap: spacing[2],
    paddingBottom: spacing[2],
  },
});

export default CategoryBottomSheet;
