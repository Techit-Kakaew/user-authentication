import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import '../../styles/SignInStyle.css'


const SignInPage = () => (
    <div>
        <SignInForm />
    </div>
);

class SignInFormBase extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: null,
            fetching: false,
        }
    }

    handleSignIn = async e => {
        try {
            e.preventDefault();
            const { email, password } = this.state;
            this.setState({fetching: true, error: null})
            await this.props.firebase.doSignInWithEmailAndPassword(email, password)
            this.setState({ email, password, fetching: false });
            this.props.history.push(ROUTES.USER_MANAGEMENT);
        } catch (error) {
            this.setState({ error: 'User not found!', fetching: false });
        }
    }

    handleChangeText = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div style={{background: "#333333", width: "100%", height: "calc(100vh - 3.5rem)"}}>
                
                <Container className="center-screen">
                    <Row>
                        <Col>
                            <h1 className="text-center text-white">SignIn</h1>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={6} xs={12}>
                            <Form onSubmit={this.handleSignIn}>
                                <Form.Group controlId="email">
                                    <Form.Label className="text-white">Email</Form.Label>
                                    <Form.Control name="email" type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label className="text-white">Password</Form.Label>
                                    <Form.Control name="password" type="password" placeholder="Enter password" value={this.state.password} onChange={this.handleChangeText} />
                                </Form.Group>
                                <span className="text-danger">{this.state.error}</span> 
                                <Form.Group className="text-center">
                                    <Button variant="primary" type="submit" disabled={this.state.fetching}>
                                        {this.state.fetching ? <Spinner as="span" animation="grow" variant="danger" size="sm" role="status" aria-hidden="true" /> : ''}
                                        {this.state.fetching ? 'Loading...' : 'Submit'}
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <SignUpLink />
                </Container>
            </div>
        )
    }
}

const condition = authUser => !!authUser;

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default withAuthorization(condition)(SignInPage)

export {SignInForm}