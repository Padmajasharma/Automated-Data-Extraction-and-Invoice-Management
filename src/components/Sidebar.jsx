import { NavLink } from 'react-router-dom';
import { FaList, FaBox } from 'react-icons/fa';
import { Container, Row, Col, Navbar, Nav, Card } from "react-bootstrap";
const sidebarItems = [
  { path: '/invoices', icon: <FaList />, label: 'Invoices' },
  { path: '/products', icon: <FaBox />, label: 'Products' },
  // Add more items as needed
];

const Sidebar = () => {
  return (
    <aside className="bg-light">
      <h5 className="text-center mt-3">Dashboard</h5>
      <Nav className="flex-column " activeKey="/home">
        {sidebarItems.map((item, index) => (
          <NavLink 
            key={index}
            to={item.path}
            className="sidebar-link d-flex gap-2"
            activeClassName="active"
            exact // Use exact if you want the active link to match the path exactly
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </Nav>
    </aside>
  );
};

export default Sidebar;
