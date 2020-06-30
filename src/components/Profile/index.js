import React, {Component} from "react";
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import '../../styles/SignInStyle.css'
import { withFirebase } from '../Firebase'
import { withAuthorization } from '../Session';
import * as ROUTES from "../../constants/routes";

class ProfilePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            first_name: '',
            last_name: '',
            age: '',
            address: '',
            phone_number: '',
            fetching: false,
        }
    }
    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
              if (!condition(authUser)) {
                this.props.history.push(ROUTES.SIGN_IN);
              }
            },
        );
        
        var firestore
        firestore = this.props.firebase.doGetUser()
        this.handleGetData(firestore, this.props.match.params.uid)
    }

    componentWillUnmount() {
        this.listener();
      }

    handleGetData = async (firestore, uid) => {
        this.setState({fetching: true})
        const user = await firestore.collection('users').doc(uid).get()
        const getUser = user.data()
        this.setState({
            first_name: getUser.first_name,
            last_name: getUser.last_name,
            age: getUser.age,
            address: getUser.address,
            phone_number: getUser.phone_number,
            fetching: false
        })
    }

    handleUpdateProfile = () => {
        const { first_name, last_name, age, address, phone_number } = this.state
        this.setState({fetching: true})
        this.props.firebase.doUpdateUser(first_name, last_name, phone_number, age, address, this.props.match.params.uid).then(() => {
            this.setState({fetching: false})
        })
    }

    handleChangeText = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const { first_name, last_name, fetching } = this.state
        const isInvalid =
            first_name === '' ||
            last_name === '';

        if(fetching) {
            return (
                <Container className="center-screen">
                    <Row>
                        <Col className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return (
                <Container className="center-screen-custom">
                    <Row>
                        <Col>
                            <h1 className="text-center">Edit Profile</h1>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={6} xs={12}>
                            <Form onSubmit={this.handleUpdateProfile}>
                                <Form.Group controlId="first_name">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control name="first_name" type="text" value={this.state.first_name} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="last_name">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control name="last_name" type="text" value={this.state.last_name} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="age">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control name="age" type="number" min="1" max="200" value={this.state.age} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="address">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control name="address" type="text" value={this.state.address} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group controlId="phone_number">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control name="phone_number" type="text" value={this.state.phone_number} onChange={this.handleChangeText} />
                                </Form.Group>
                                <Form.Group className="text-center">
                                    <Button disabled={isInvalid} variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

const condition = authUser => !!authUser;

export default withFirebase(ProfilePage)
