import { useCallback, useState } from 'react';

export const useNewItem = <T extends object>(
  defaultItem: T,
  onSave: (newItem: T) => void
) => {
  const [newItem, setNewItem] = useState<T>();

  const startAddingItem = () => {
    setNewItem(defaultItem);
  };

  const cancelAddingItem = () => {
    setNewItem(undefined);
  };

  const saveNewItem = () => {
    setNewItem(undefined);
    if (!newItem) return;
    onSave(newItem);
  };

  const updateNewItem = (columnId: string, value: unknown) => {
    setNewItem((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [columnId]: value,
      };
    });
  };

  const addItemToData = useCallback(
    (data: T[]) => {
      if (!newItem) return data;
      return [...data, newItem];
    },
    [newItem]
  );

  return {
    newItem,
    startAddingItem,
    cancelAddingItem,
    saveNewItem,
    updateNewItem,
    addItemToData,
  };
};
