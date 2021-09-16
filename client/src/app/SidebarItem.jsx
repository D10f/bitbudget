import { Link } from 'react-router-dom';

const SidebarItem = ({ to, name, text, currency, active = false }) => {

  // Lowercase the "name" prop and replace spaces with hyphens to accommodate the
  // CSS naming convention for this element.
  const classString = active
    ? 'sidebar__item sidebar__item--active'
    : `sidebar__item sidebar__item--${name.toLowerCase().replace(' ', '-')}`;

  return (
    <li className={classString}>
      <Link
        className={currency ? "sidebar__link sidebar__link--wallet" : "sidebar__link"}
        to={to}
        name={name}
        currency={currency}
      >
        {text}
      </Link>
    </li>
  );
};

export default SidebarItem;
