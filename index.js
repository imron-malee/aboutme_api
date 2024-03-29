
const { initializeApp } = require("firebase/app")
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDatabase, set, ref, get, update, remove } = require("firebase/database");
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const cors = require('cors');

var app2 = express()
app2.use(bodyParser.json());
app2.use(bodyParser.urlencoded({extended: true}))

//Allow cors origin
var allowlist = ['http://localhost:3000', 'https://imron-malee.github.io']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { 
        origin: true, // reflect (enable) the requested origin in the CORS response
        credentials:true, //access-control-allow-credentials:true
    } 
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


var server = app2.listen(3001, console.log('server is running on port 3001'))

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID // Optional, if you have it in your new project
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

app2.get('/api/test/:fullname', cors(corsOptionsDelegate),(req, res) => {
    const { fullname } = req.params;
    res.send(fullname)
})
//create
app2.post('/api/create', cors(corsOptionsDelegate), (req,res) => {
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

app2.get('/api/getbyname/:fullname', cors(corsOptionsDelegate),(req, res) => {
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

