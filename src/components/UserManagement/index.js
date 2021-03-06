import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { withAuthorization } from '../Session';
import '../../styles/SignInStyle.css'
import * as ROUTES from "../../constants/routes";

class UserManagementPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fetching: false,
            users: []
        }
    }

    componentDidMount() {
      var firestore
      firestore = this.props.firebase.doGetUser()
      this.handleGetData(firestore)
    }

    handleGetData = async (firestore) => {
      this.setState({fetching: true})
      const users = await firestore.collection("users").get()
      const usersObj = users.docs.map((doc) => doc.data())
      const userList = usersObj.map((user, i) => ({
        ...user,
        uid: users.docs[i].id
      }))
      this.setState({users: userList})
      this.setState({fetching: false})
    }

    render() {
        const { users, fetching } = this.state;
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
              <Container className="mt-5">
                  <Row>
                      <Col>
                          <h1>User Management</h1>
                      </Col>
                  </Row>
                  <Row>
                      <Col>
                          <UserList users={users} push={this.props} />
                      </Col>
                  </Row>
              </Container>
            )
        }
        
    }
}

const UserList = ({ users, push }) => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Email</th>
          <th>Full Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.uid}>
            <td>{user.email}</td>
            <td>{user.first_name + ' ' + user.last_name}</td>
            <td><Link to={{pathname: ROUTES.ACCOUNT+`/${user.uid}`}}>Edit</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(UserManagementPage);