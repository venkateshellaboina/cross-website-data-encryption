const port = process.env.PORT || 5001;
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));


app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}
);

const { encrypt, decrypt } = require('./crypto');


app.post('/encrypt', (req, res) => {
    // console.log(req)
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var gender = req.body.gender;
    var email = req.body.email;
    let dob = req.body.dob;

    var formData = "firstname:" + firstname + "|" + "lastname:"  + lastname + "|"  + "gender:"  + gender + "|"  + "email:"  + email + "|"  + "dob:"  + dob ;
    var text = String(formData);


    const hash = encrypt(text);
    res.send(JSON.stringify(hash))
    res.end();
})

app.post('/decrypt', (req, res) => {
    var ssn = req.body.ssn;
    var score = req.body.score;
    var token = req.body.token.split('|')[0];
    var iv = req.body.token.split('|')[1]

    let d = {
        content: token,
        iv: iv
    }

    console.log(d)

 
    const hash = decrypt(d);
    let hash_values = hash.split('|')
    let data = {
        firstname : hash_values[0].split(':')[1],
        lastname : hash_values[1].split(':')[1],
        gender : hash_values[2].split(':')[1],
        email : hash_values[3].split(':')[1],
        dob: hash_values[4].split(':')[1],
        ssn: ssn,
        score: score
    }

    console.log(data)
    
    res.send("success")



    res.end();
})

