import React from 'react';
import { withRouter } from './router/withRouter';
import {Form, Button, Container} from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';


class ScoreGenerator extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            ssn : null,
            score : 0,
            showScore: false,
            isDisabled: true,
            showSubmit: false,
            token: this.props.params.token,
            datasent: false,
            circScore: 66
        }
        console.log(this.props.params.token)
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        }, () => {
            let ssn = this.state.ssn;
            let len = (ssn.toString()).length
            ssn = Number(ssn);
    
            if(!ssn || len != 9){
                this.setState({
                    isDisabled : true
                })
            }
            else{
                this.setState({
                    isDisabled : false
                })
            }
        })
    }

    generateScore = () => {
        let ssn = this.state.ssn;
        ssn = Number(ssn);
        if(!ssn){
            return
        }
        else{
            let score = Math.floor(Math.random() * 700);
            this.setState({
                score,
                showScore: true,
                showSubmit: true
            })
        }
    }

    submitData = async () => {
        let data = {
            ssn: this.state.ssn,
            score: this.state.score,
            token: this.props.params.token
        }
        console.log(data)
        let url="http://localhost:5001/decrypt/"
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json',
                     'Accept': 'application/json, text/plain, */*',
                },
                body: JSON.stringify({
                    ssn : this.state.ssn,
                    score: this.state.score,
                    token : this.state.token
                })

            })
            if(response.status == 200){
                this.setState({
                    datasent: true
                })
            }
    }

    render(){

        return (
            <div>
                
                <Container style={{width: "30%", paddingTop: "20vh"}}>
                    {this.state && this.state.showScore && 
                            <div>
                                <h1>Your Credit score: </h1>

                                <div style={{height: "10vh", width: "10vw", margin: "auto", marginBottom: "20vh"}}>

                                    <CircularProgressbar value={this.state.score} maxValue={700}  text={`${this.state.score}`} />
                                </div>
                            </div>

                    }
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>Enter SSN Id</Form.Label>
                            <Form.Control type="text" maxLength="9" placeholder="SSN Id" name="ssn" value={this.state.ssn} onChange={this.handleChange} />
                        </Form.Group>
                        {this.state && !this.state.showSubmit && 
                            <Button variant="primary" type="button" disabled={this.state.isDisabled} onClick={this.generateScore}>
                                Generate Score
                            </Button>
                        }
                    </Form>
                
                    {this.state && this.state.showSubmit && 
                         <Button variant="primary" type="button" onClick={this.submitData}>
                            Submit
                        </Button>
                    }
                     {this.state && this.state.datasent && 
                        <h3 style={{color : "green"}}>Your data has been successfully sent</h3>
                    }
                </Container>
            </div>
        );
    }
}

export default withRouter(ScoreGenerator)
    