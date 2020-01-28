const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')
const node_client = require('./node-client.js')
const saturday = require('./logic/saturdayCalculator')
const auth=require('./logic/auth')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const passwordHashing = require('./logic/passwordHashing')
const app =express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/api/store', (req, res) => {
    const userRef = node_client.ref.child('data/'+req.body.day);
    userRef.once("value")
        .then(function (snapshot) {
            let fetchData = snapshot.val();  // true

            if (fetchData !== null) {

                res.send('Data already exist')

            }
            else {
                if (req.body.day === null || req.body.day === undefined)  {
                    res.send('Missing day parameter')
                }
                else {

                    for (let data of saturday.test(req.body.members, req.body.day)) {

                        let storeData = {date: data[0], member: data[1], day: req.body.day}
                        userRef.push(storeData)
                    }
                    res.send('Data Saved in Database')
                }
            }
        });
})

app.get('/api/delete/:day', (req, res) => {


    const userRef = node_client.ref.child('data/'+req.params.test);
    userRef.remove()
    res.send('Data Deleted from Database')
})


app.post('/api/fetchAll', async (req, res) => {
    var data1 = [];
    const test = await node_client.ref.once('value', function (snapshot) {
        snapshot.forEach(function (data) {
            data.forEach((u) => {
                data1.push(u.val());
            })
        });
    })
    res.status(200).send(data1);
})



app.post('/api/replace',async (req,res)=>{
    let count=0
    let changeDate=''
    let changeMember=''
    let changeKey=''
    let changedDate=''
    let changedMember=''
    let changedKey=''

   const refChild= node_client.ref.child('data')
    const test = await refChild.once('value',(data)=>{
        let data1=data.val()
        let keys = Object.keys(data1)

            for(let i=0;i<keys.length;i++)
            {
                let k=keys[i]
                let date = data1[k].date
                let member=data1[k].member

                if(req.body.date1==req.body.date2)
                    count++

                if(date==req.body.date1)
                {
                    changeDate=date
                    changeMember=member
                    changeKey=k
                    count++
                }

                if(date==req.body.date2)
                {
                    changedDate=date
                    changedMember=member
                    changedKey=k
                    count++
                }
            }
    })

    if(count==2)
    {
        const swap = await node_client.db.ref('/user/data/' + changeKey).update({member: changedMember})
        const swap1 = await node_client.db.ref('/user/data/' + changedKey).update({member: changeMember})
        res.send('replacement done')
    }

    else
        res.send("Cannot Replace")
    })


app.get('/api/token', (req, res) => {
    if (req.body.user === '' || req.body.password === '') {
        res.status(400).send("Complete user information not provided")
    }
    else {
        const token = jwt.sign({user: req.body.password, password: req.body.password}, process.env.JWTToken)
        res.send(token)
    }
})

app.post('/api/test', auth, async (req, res) => {

    let pass = await passwordHashing(req.body.password, (data) => {
        res.send(data)
    })

    })


app.listen(process.env.PORT || 3001,()=>{
    console.log(`Listening on port ${process.env.PORT}`)

})