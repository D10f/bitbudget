import React, { ReactEventHandler, useState } from "react";
import styled from "styled-components";

import { useAppDispatch } from "../../../common/hooks/useAppDispatch";
import { useAppSelector } from "../../../common/hooks/useAppSelector";
import { addNotification } from "../../notifications/notificationsSlice";
import { selectCategories, updateCategories } from "../categoriesSlice";

import Button from "../../../common/components/Button/Button";
import Row from "../../../common/components/Row/Row";

interface ICategoriesList {
  submitCallback: () => void;
}

const CategoryInput = styled.input`
  background: none;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark.default};
  width: 100%;
  background: none;
  color: inherit;
  font-size: 2rem;
  padding: 1rem;
  text-align: center;
`;

const CategoryList = styled.ul`
  max-width: 50rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 3rem 0;
`;

const CategoryTag = styled.li`
  font-size: 1.4rem;
  display: inline-block;
  padding: 0.4rem 0.4rem 0.4rem 0.8rem;
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  background-color: ${({ theme }) => theme.colors.light.default};
  color: ${({ theme }) => theme.colors.dark.default};

  &:hover {
    background-color: none;
    background-image: linear-gradient(
      to right bottom,
      ${({ theme }) => theme.colors.primary.light},
      ${({ theme }) => theme.colors.primary.dark}
    );
    color: ${({ theme }) => theme.colors.light.default};
    cursor: default;
  }

  &:hover span {
    opacity: 1;
  }
`;

const DeleteButton = styled.span`
  padding: 0.5rem;
  opacity: 0.5;
  
  &:hover {
    color: ${({ theme }) => theme.colors.dark.default};
    cursor: pointer;
  }
`;

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
        dispatch(addNotification({ msg: "Category already exists", type: "info" }))
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
    <>
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
      <Row marginless>
        <Button variant="action" onClick={handleSave}>Save</Button>
        <Button variant="link" onClick={submitCallback}>Cancel</Button>
      </Row>
    </>
  );
};

export default CategoriesList;
