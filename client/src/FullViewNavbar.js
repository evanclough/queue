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

const FullViewNavbar = ({socket, toggleView, backToHomepage, room, accountInfo}) => {
    return (
        <Navbar color="dark" dark={true}>
        <Nav>
            <Button
                onClick = {backToHomepage}
                className="mx-1"
            > 
                Home
            </Button>
            <Button  
                onClick = {toggleView}
                className="mx-1"
            >
                Switch View
            </Button>
            
            <NavbarBrand
                className='mx-3'
            >
              Room: {room}
            </NavbarBrand >
        </Nav>
      </Navbar>
    )
}

export default FullViewNavbar;