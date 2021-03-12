import React, { Component } from 'react';
import { Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const {isAuthenticated, signInWithRedirect, signOut} = this.props;

    return <Navbar color="light" light expand="md">
      <NavbarBrand tag={Link} to="/">Tic Tac Toe Home</NavbarBrand>
      <NavbarToggler onClick={this.toggle}/>
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          {!isAuthenticated ?
            <NavItem>
              <Button color="secondary" outline onClick={signInWithRedirect}>Sign in</Button>
            </NavItem> :
            <NavItem>
              <Button color="secondary" outline onClick={signOut}>Sign out</Button>
            </NavItem>
          }
        </Nav>
      </Collapse>
    </Navbar>;
  }
}

export default NavBar;