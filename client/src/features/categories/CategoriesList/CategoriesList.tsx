import React, { useState } from "react";

import { useAppDispatch } from "@hooks/useAppDispatch";
import { useAppSelector } from "@hooks/useAppSelector";
import { addNotification } from "@features/notifications/notificationsSlice";
import {
  selectCategories,
  updateCategories,
} from "@features/categories/categoriesSlice";

import Button from "@components/Button/Button";
import {
  CategoryContainer,
  CategoryInput,
  CategoryList,
  CategoryTag,
  DeleteButton,
} from "./CategoriesList.styled";

interface ICategoriesList {
  submitCallback: () => void;
}

const CategoriesList = ({ submitCallback }: ICategoriesList) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const [currentCategories, setCurrentCategories] = useState(categories);
  const [newCategoryValue, setNewCategoryValue] = useState("");

  const removeCategory = (catToDelete: string) =>
    setCurrentCategories((prev) => prev.filter((cat) => cat !== catToDelete));

  const addCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const match = currentCategories.find((cat) => cat === newCategoryValue);
      if (match) {
        dispatch(
          addNotification({ msg: "Category already exists", type: "info" })
        );
        return;
      }
      setCurrentCategories((prev) => [...prev, newCategoryValue]);
      setNewCategoryValue("");
    }
  };

  const handleSave = () => {
    dispatch(updateCategories(currentCategories));
    submitCallback();
  };

  return (
    <CategoryContainer>
      <CategoryInput
        placeholder="Add New Category"
        value={newCategoryValue}
        onChange={(e) => setNewCategoryValue(e.target.value)}
        onKeyPress={addCategory}
      />
      <CategoryList>
        {currentCategories.map((category) => (
          <CategoryTag key={category}>
            {category}
            <DeleteButton onClick={() => removeCategory(category)}>
              &times;
            </DeleteButton>
          </CategoryTag>
        ))}
      </CategoryList>
      <Button variant="action" onClick={handleSave}>
        Save
      </Button>
    </CategoryContainer>
  );
};

export default CategoriesList;
