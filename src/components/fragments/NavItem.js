import { NavLink } from 'react-router-dom';

const NavItem = (props) => {
  return (
    <li>
      <NavLink
        to={props.path}
        // TODO import active?
        className={({ isActive }) => isActive ? 'active' : undefined}
      >
        {props.title}
      </NavLink>
    </li>
  );
};

export default NavItem;