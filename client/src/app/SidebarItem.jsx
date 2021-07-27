import { Link } from 'react-router-dom';

const SidebarItem = ({ to, name, active = false, text }) => {

  // Lowecase the "name" prop and replace spaces with hyphens to accommodate the
  // CSS naming convention for this element.
  const classString = active
    ? 'sidebar__item sidebar__item--active'
    : `sidebar__item sidebar__item--${name.toLowerCase().replace(' ', '-')}`;

  return (
    <li className={classString}>
      <Link
        className="sidebar__link"
        to={to}
        name={name}
      >
        {text}
      </Link>
    </li>
  );
};

export default SidebarItem;
