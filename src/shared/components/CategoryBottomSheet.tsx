import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, radius, spacing, typography} from '../theme';
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, {paddingBottom: insets.bottom + spacing[4]}]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Select category</Text>
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
    backgroundColor: colors.surface,
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
    backgroundColor: colors.borderLight,
    marginBottom: spacing[4],
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing[3],
  },
  list: {
    gap: spacing[2],
    paddingBottom: spacing[2],
  },
});

export default CategoryBottomSheet;
