import axios from "axios";
import React, { Component } from "react";

class ApiComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message : ""
        }
    }

    componentDidMount() {
        this.getApi();
    }

    getApi = () => {
        axios.get("http://localhost:8080/list/posts")
            .then(res => {
                console.log(res);
                this.setState({
                    message: res.data.message
                })
            })
            .catch(res => console.log(res))
    }

    render () {
        return (
            <div>
                Api Message : 
                { this.state.message }
            </div>
        )
    }
}

export default ApiComponent;