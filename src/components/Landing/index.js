import React, {Component} from "react";
import '../../styles/SignInStyle.css'
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { Container, Row, Col } from 'react-bootstrap';
import { withFirebase } from '../Firebase'

class LandingPage extends Component {
    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
              if (condition(authUser)) {
                this.props.history.push(ROUTES.USER_MANAGEMENT);
              }
            },
        );
    }

    render() {
        return (
            <div style={{background: "#333333", width: "100%", height: "calc(100vh - 3.5rem)"}}>
                <Container className="center-screen">
                    <Row>
                        <Col>
                            <h1 className="text-center text-white">Landing Page</h1>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col className="text-center">
                            <Link className="btn btn-primary" to={{pathname: ROUTES.SIGN_IN}}>SIGN IN</Link>
                            <Link className="btn btn-success ml-3" to={{pathname: ROUTES.SIGN_UP}}>SIGN UP</Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const condition = authUser => !!authUser;

export default withFirebase(LandingPage)