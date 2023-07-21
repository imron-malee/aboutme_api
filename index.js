const { initializeApp } = require("firebase/app")
const { getDatabase, set, ref, get, update, remove } = require("firebase/database");
const express = require('express');
const bodyParser = require("body-parser");
const { json } = require("body-parser");

var app2 = express()
app2.use(bodyParser.json());
app2.use(bodyParser.urlencoded({extended: true}))
var server = app2.listen(3001, console.log('server is running on port 3001'))

const firebaseConfig = {
    databaseURL: "https://learn-bb64f-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(firebaseConfig)
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

