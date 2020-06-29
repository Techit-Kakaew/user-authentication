import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

import SignOutButton from '../SignOut';
import { Navbar, Nav } from 'react-bootstrap';

const Navigation = ({ authUser }) => (
    <div>{authUser ? <NavigationAuth/> : <NavigationNonAuth />}</div>
);

const NavigationAuth = () => (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand>User Authentication</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                <Link className="nav-link" to={ROUTES.USER_MANAGEMENT}>User Management</Link>
                <SignOutButton />
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

const NavigationNonAuth = () => (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand>User Authentication</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                <Link className="nav-link" to={ROUTES.SIGN_IN}>Sign In</Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default Navigation;