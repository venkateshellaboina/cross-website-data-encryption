import React from 'react';
import {Form, Button, Container} from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";
import { withRouter } from './router/withRouter';
import DatePicker from "react-datepicker";
  

 class Home extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            firstname : "",
            lastname : "",
            gender : "Male",
            email : "",
            dob: "",
            error: false,
            agreeConditions: false        }
        this.redirectToScore = React.createRef(null);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    validateDate = (date) =>{
        let date_values = date.split('/')
        let month = Number(date_values[0])
        let day = Number(date_values[1])
        let year = Number(date_values[2])
        if(month >=1 && month <=12 && day >= 1 && day <= 31 && year <=2022)
        {
            return true
        }
        return false
    }


    isValid = () => {
        if (!this.state.firstname
            || !this.state.lastname
            || !this.state.gender
            || !this.state.email
            || !this.state.agreeConditions
            || !this.validateDate(this.state.dob)
            ){
            this.setState({
                error: true
            })
            return false
        }
        this.setState({
            error: false
        })
        return true
    }

     submitForm = async () => {
        if(!this.isValid()){
            return
        }
        else{
            let url="http://localhost:5001/encrypt/"
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json',
                     'Accept': 'application/json, text/plain, */*',
                },
                body: JSON.stringify({
                    firstname : this.state.firstname,
                    lastname: this.state.lastname,
                    email : this.state.email,
                    gender: this.state.gender,
                    dob: this.state.dob 
                })

            })
            response = await response.json()
            let token = response.hashedData + "|" + response.initialisationVector
            this.setState({
                token
            }, () => {
                this.redirectToScore.current.click()
            })
        }
        console.log(this.state)
    }
    checkboxChange = () => {
        this.setState({
            agreeConditions : !this.state.agreeConditions 
        })
    }
    render(){
        return(
            <Container style={{width: "30%", paddingTop: "25vh"}}>
                <Form>
                    {this.state && this.state.error && 
                        <h6 style={{color: "red"}}> Please make sure that all of the values are right. </h6>
                    }
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                       
                        <Form.Control required type="email" placeholder="Email" name="email" value={this.state.email} onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name" name="firstname" value={this.state.firstname} onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name" name="lastname" value={this.state.lastname} onChange={this.handleChange} />
                    </Form.Group>

    
                    <Form.Group className="mb-3" controlId="formBasicGender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select aria-label="Male" name="gender" onChange={this.handleChange} value={this.state.gender}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicDOB">
                        <Form.Label>Date of Birth</Form.Label>
                        {/* <DatePicker /> */}
                        <Form.Control type="text" placeholder="MM/DD/YYYY" name="dob" value={this.state.dob} onChange={this.handleChange} />
                    </Form.Group>

    
                    
    
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" name="agreeConditions" value={this.state.agreeConditions} onChange={this.checkboxChange}  label="Agree and re-direct to an external page" />
                    </Form.Group>
    
                    <Button variant="primary" type="button" onClick={this.submitForm}>
                        Submit
                    </Button>
                </Form>
                <Link
                    to={"/score/" + this.state.token}
                    ref={this.redirectToScore}
                    style={{display: "none"}}
                />
            </Container>
        )
    }
    
    
}




export default withRouter(Home);