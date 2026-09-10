// Field + sheet for picking a full category object (including imagePath).
import {useState} from 'react';
import type {Category} from '../data/categories';
import CategoryBottomSheet from './CategoryBottomSheet';
import CategorySelectorCard from './CategorySelectorCard';

export type CategoryPickerProps = {
  selectedCategory?: Category;
  onSelect: (category: Category) => void;
  error?: string;
};

const CategoryPicker = ({
  selectedCategory,
  onSelect,
  error,
}: CategoryPickerProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <CategorySelectorCard
        category={selectedCategory}
        error={error}
        onChangePress={() => setVisible(true)}
      />
      <CategoryBottomSheet
        visible={visible}
        selectedId={selectedCategory?.id}
        onSelect={onSelect}
        onClose={() => setVisible(false)}
      />
    </>
  );
};

export default CategoryPicker;
