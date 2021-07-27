import Tag from '../../components/Tag';

// Categories is a JavaScript Set
const CategoryList = ({ categories, handleRemoveCategory }) => (
  <ul className="profile__categories">
    {[...categories].map(category => (
      <Tag
        key={category}
        value={category}
        onClick={() => handleRemoveCategory(category)}
      />
    ))}
  </ul>
);

export default CategoryList;
