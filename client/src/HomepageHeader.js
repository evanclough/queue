import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    InputGroup,
    Button
     } from 'reactstrap';
import ConnectedUsers from './ConnectedUsers';

const HomepageHeader = () => {
    return (
        <Navbar color="dark" dark={true}>
        <Nav className="mx-auto">
            <h1 id="homepageHeaderQueue"
            >
             Queue!
            </h1 >
        </Nav>
      </Navbar>
    )
}

export default HomepageHeader;