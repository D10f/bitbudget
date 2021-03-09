const CategoryItem = ({ category, checked, setCategory }) => (
  <>
    <input
      type="radio"
      className="form__checkbox"
      id={category}
      checked={checked}
      onChange={setCategory}
    />
    <label
      className="form__category"
      htmlFor={category}
      tabIndex="0"
    >
      {category}
    </label>
  </>
);

export default CategoryItem;
