/* eslint-disable no-useless-escape */
import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { compose } from 'recompose';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import '../../styles/SignInStyle.css'

const SignUpPage = () => (
    <div>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    first_name: { value: '', textNoti: '' },
    last_name: { value: '', textNoti: '' },
    email: { value: '', textNoti: '' },
    password: { value: '', textNoti: '' },
    passwordConfirmation: { value: ''},
    age: { value: '' },
    address: {value: ''},
    phone_number: {value: ''},
    error: null,
    fetching: false,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props)

        this.state = { ...INITIAL_STATE }
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
              if (condition(authUser)) {
                this.props.history.push(ROUTES.USER_MANAGEMENT)
              }
            },
        );
        this.setState({...INITIAL_STATE})
    }

    emailValidation = (email) => {
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return re.test(email)
    }

    validationForm = (data) => {
        if(data['first_name'] === '') {
            this.setState({first_name: {value: data['first_name'], textNoti: 'Please enter first name'}})
            data['first_name'] = false
            this.textValidateNotificaion(this.state.first_name.textNoti)
        } else {
            data['first_name'] = true
        }

        if(data['last_name'] === '') {
            this.setState({last_name: {value: data['last_name'], textNoti: 'Please enter last name'}})
            data['last_name'] = false
            this.textValidateNotificaion(this.state.last_name.textNoti)
        } else {
            data['last_name'] = true
        }

        if(data['email'] === '') {
            this.setState({email: {value: data['email'], textNoti: 'Please enter email'}})
            data['email'] = false
            this.textValidateNotificaion(this.state.email.textNoti)
        } else if(!this.emailValidation(data['email'])) {
            this.setState({email: {value: data['email'], textNoti: 'Invalid email format'}})
            data['email'] = false
            this.textValidateNotificaion(this.state.email.textNoti)
        } else {
            data['email'] = true
        }

        if(data['password'] === '') {
            this.setState({password: {value: data['password'], textNoti: 'Please enter password'}})
            data['password'] = false
            this.textValidateNotificaion(this.state.password.textNoti)
        } else if(data['password'] !== data['passwordConfirmation']) {
            this.setState({password: {value: data['password'], textNoti: 'Password mismatch !'}})
            data['password'] = false
            this.textValidateNotificaion(this.state.password.textNoti)
        } else {
            data['password'] = true
        }

        if(data['first_name'] && data['last_name'] && data['email'] && data['password']) {
            return ({success: true, message: ''})
        } else {
            return ({success: false, message: 'Please complete this form before submit'})
        }
    }

    textValidateNotificaion = (message) => {
        if(message) {
            return (<span className="text-danger">{message}</span>)
        } else {
            return null
        }
    }

    handleRegister = (e) => {
        e.preventDefault();
        var first_name = this.state.first_name.value,
            last_name = this.state.last_name.value,
            email = this.state.email.value,
            password = this.state.password.value,
            passwordConfirmation = this.state.passwordConfirmation.value,
            age = this.state.age.value,
            address = this.state.address.value,
            phone_number = this.state.phone_number.value

        var data = {}
        data['first_name'] = first_name
        data['last_name'] = last_name
        data['email'] = email
        data['password'] = password
        data['passwordConfirmation'] = passwordConfirmation

        var validated = this.validationForm(data)
        
        if(validated.success) {
            this.setState({ error: validated.message, fetching: true })
            this.props.firebase.doStoreUser(first_name, last_name, email, phone_number, age, address ).then(() => {
                this.props.firebase.doCreateUserWithEmailAndPassword(email, password).then(() => {
                    this.setState({...INITIAL_STATE})
                    this.props.history.push(ROUTES.SIGN_IN)
                })
                .catch(error => {
                    this.setState({ fetching: false })
                })
            }).catch(error => {
                this.setState({ fetching: false })
            })
        } else {
            this.setState({ error: validated.message, fetching: false })
        }
        
    }

    handleChangeText = (e) => {
        this.setState({ [e.target.name]: {value: e.target.value, textNoti: ''} })
    }

    render() {
        return (
            <div className="bg-screen">
                <Container>
                    <Row>
                        <Col>
                            <h1 className="text-center text-white">SignUp</h1>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={6} xs={12}>
                            <Form onSubmit={this.handleRegister}>
                                <Form.Group controlId="first_name">
                                    <Form.Label className="text-white">First name*</Form.Label>
                                    {this.textValidateNotificaion(this.state.first_name.textNoti)}
                                    <Form.Control name="first_name" type="text" placeholder="Enter first name" value={this.state.first_name.value} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="last_name">
                                    <Form.Label className="text-white">Last name*</Form.Label>
                                    {this.textValidateNotificaion(this.state.last_name.textNoti)}
                                    <Form.Control name="last_name" type="text" placeholder="Enter last name" value={this.state.last_name.value} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Label className="text-white">Email*</Form.Label>
                                    {this.textValidateNotificaion(this.state.email.textNoti)}
                                    <Form.Control name="email" type="email" placeholder="Enter email" value={this.state.email.value} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label className="text-white">Password*</Form.Label>
                                    {this.textValidateNotificaion(this.state.password.textNoti)}
                                    <Form.Control name="password" type="password" autoComplete="new-password" placeholder="Enter password" value={this.state.password.value} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="passwordConfirmation">
                                    <Form.Label className="text-white">Password Confirmation*</Form.Label>
                                    <Form.Control name="passwordConfirmation" type="password" placeholder="Enter passwordConfirmation" value={this.state.passwordConfirmation.value} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="age">
                                    <Form.Label className="text-white">Age</Form.Label>
                                    <Form.Control name="age" type="number" min="1" max="200" placeholder="Enter your age" value={this.state.age.value} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="phone_number">
                                    <Form.Label className="text-white">Phone number</Form.Label>
                                    <Form.Control name="phone_number" type="text" placeholder="Enter your phone number" value={this.state.phone_number.value} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="address">
                                    <Form.Label className="text-white">Address</Form.Label>
                                    <Form.Control name="address" placeholder="Enter your address" as="textarea" rows="3" value={this.state.address.value} onChange={this.handleChangeText} />
                                </Form.Group>
                                <span className="text-danger">{this.state.error ? this.state.error : null}</span>
                                <Form.Group className="text-center">
                                    <Button variant="primary" type="submit" disabled={this.state.fetching}>
                                        {this.state.fetching ? <Spinner as="span" animation="grow" variant="danger" size="sm" role="status" aria-hidden="true" /> : ''}
                                        {this.state.fetching ? 'Loading...' : 'Submit'}
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

class SignUpLink extends Component {
    render() {
        return (
            <div>
                <p className="text-center text-white">Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link></p>
            </div>
        )
    }
}
const condition = authUser => !!authUser;
const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage

export { SignUpForm, SignUpLink };