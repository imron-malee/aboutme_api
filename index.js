
const { initializeApp } = require("firebase/app")
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDatabase, set, ref, get, update, remove } = require("firebase/database");
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const bodyParser = require("body-parser");
const { json } = require("body-parser");

var app2 = express()
app2.use(bodyParser.json());
app2.use(bodyParser.urlencoded({extended: true}))
var server = app2.listen(3001, console.log('server is running on port 3001'))

// const firebaseConfig = {
//     databaseURL: "https://learn-bb64f-default-rtdb.asia-southeast1.firebasedatabase.app/"
// }
const firebaseConfig = {
    apiKey: "AIzaSyA6WtTqQsK1PI71EpZuKEe6ZikmKLOaBZ4",
    authDomain: "learn-bb64f.firebaseapp.com",
    databaseURL: "https://learn-bb64f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "learn-bb64f",
    storageBucket: "learn-bb64f.appspot.com",
    messagingSenderId: "624387657784",
    appId: "1:624387657784:web:535daae3e8bab161c416cd",
    measurementId: "G-G7VLWTED9C"
};
const app = initializeApp(firebaseConfig)

//Authentication
const auth = getAuth();
const email = process.env.AUTH_EMAIL;
const password = process.env.AUTH_PASSWORD
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    //console.log(user)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    //console.log(error)
});

const db = getDatabase(app)
app2.get('/', (req,res) => {
    res.send('Hello')
})

app2.get('/api/test/:fullname', (req, res) => {
    const { fullname } = req.params;
    res.send(fullname)
})
//create
app2.post('/api/create', (req,res) => {
    const jsonData = req.body;
    const data2 = {
        date: new Date() + ''
    };

    const insertData = { ...jsonData, ...data2 };
    
    try {
        set(ref(db, 'aboutme/' + insertData.fullname), insertData)
        return res.status(201).json({
            RespCode: 201,
            RespMessage: 'Inserted'
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            RespCode: 500,
            RespMessage: err.message
        })
    }
})

app2.get('/api/getbyname/:fullname', (req, res) => {
    const { fullname } = req.params;
    // return res.status(200).json({
    //     RespCode: 200,
    //     RespMessage: fullname
    // })
    try {
        get(ref(db, 'aboutme/' + fullname))
        .then((snapshot) => {
            console.log(snapshot)
            if( snapshot.exists() ) {
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'good',
                    Result: snapshot.val(),
                    req:fullname
                })
            }
            else {
                return res.status(404).json({
                    RespCode: 404,
                    RespMessage: 'not found data',
                    Result: 'not found data',
                    Req:fullname
                })
            }
        })
        .catch((err2) => {
            console.log(err2)
            return res.status(500).json({
                RespCode: 500,
                RespMessage: err2.message
            })
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            RespCode: 500,
            RespMessage: err.message
        })
    }
})

