import { connect } from 'react-redux';
import CategoryItem from './CategoryItem';

const CategoryList = ({ categories, current, setCategory }) => {
  return (
    <div className="form__category-list">
      {
        categories.map(category => (
          <CategoryItem
            key={Math.random()}
            category={category}
            checked={current === category ? true : false}
            setCategory={setCategory}
          />
        ))
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
  categories: state.categories
});

export default connect(mapStateToProps)(CategoryList);

// <input
//   type="radio"
//   className="form__checkbox"
//   id="entertainment"
//   checked={category === 'entertainment' ? true : false}
//   onChange={onCategoryChange}
// />
// <label
//   className="form__category"
//   htmlFor="entertainment"
//   tabIndex="0"
// >
//   Entertainment
// </label>
