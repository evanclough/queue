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
     } from 'reactstrap';

const FullViewNavbar = ({toggleView, backToHomepage, room, accountInfo}) => {
    return (
        <Navbar color="dark" dark={true}>
        <Nav>
            <NavbarToggler  
                onClick = {backToHomepage}
            >
                back to homepage
            </NavbarToggler>
            <NavbarToggler  
                onClick = {toggleView}
            >
                toggle view
            </NavbarToggler>
            <NavbarBrand
            >
              {room}
            </NavbarBrand>
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                Account: {accountInfo.name ?? "Anonymous"}
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem>
                         Account Thing 1
                    </DropdownItem>
                    <DropdownItem>
                        Account Thing 2
                    </DropdownItem>
                </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Navbar>
    )
}

export default FullViewNavbar;