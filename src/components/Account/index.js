import React, {Component} from "react";

const Account = () => (
    <div>
        <ProfilePage />
    </div>
);

class ProfilePage extends Component {
    componentDidMount() {
        console.log(this.props.match.params.uid)
    }
    render() {
        
        return (
            <div>Profile</div>
        )
    }
}

export default Account