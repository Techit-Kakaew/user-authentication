import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
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
            error: null
        }
    }

    handleSignIn = event => {
        const { email, password } = this.state;
     
        this.props.firebase
          .doSignInWithEmailAndPassword(email, password)
          .then(() => {
            this.setState({ email, password });
            this.props.history.push(ROUTES.HOME);
          })
          .catch(error => {
            this.setState({ error });
          });
     
        event.preventDefault();
    }

    handleChangeText = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <Container className="center-screen">
                <Row>
                    <Col>
                        <h1 className="text-center">SignIn</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md={6} xs={12}>
                        <Form onSubmit={this.handleSignIn}>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email" type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleChangeText} />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Enter password" value={this.state.password} onChange={this.handleChangeText} />
                            </Form.Group>

                            <Form.Group className="text-center">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <SignUpLink />
            </Container>
        )
    }
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage

export {SignInForm}