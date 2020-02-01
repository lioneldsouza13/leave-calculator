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

const compOffTest = require('./logic/compOffCalculator')

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

                        let storeData = {date: data[0], member: data[1], day: req.body.day,leaveUsed:'No'}
                        userRef.push(storeData)
                    }
                    res.send('Data Saved in Database')
                }
            }
        });
})

app.get('/api/delete/:day', (req, res) => {


    const userRef = node_client.ref.child('data/'+req.params.day);
    userRef.remove()
    res.send('Data Deleted from Database')
})


app.post('/api/fetchAll', async (req, res) => {
    var data1 = [];
    const test = await node_client.ref.once('value', function (snapshot) {
        snapshot.forEach(function (data) {
            data.forEach((u) => {
                u.forEach((c)=>{
                    data1.push(c.val());
                })

            })
        });
    })
    res.status(200).send(data1);
})



app.post('/api/replace',async (req,res)=>{
    let count=0
    let count1=''
    let changeDate=''
    let changeMember=''
    let changeKey=''
    let changedDate=''
    let changedMember=''
    let changedKey=''
    let changeLeaveUsed=''
    let changedLeaveUsed=''

    let date = new Date(req.body.date1)
    let date1 = new Date(req.body.date2)
    let day=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let finalDay=day[date.getDay()];
    let finalDay1=day[date1.getDay()];

    if(finalDay !==finalDay1)
    {
        res.send('Cannot replace Other Dates')
        return
    }

   const refChild= node_client.ref.child('data/'+finalDay)

    const test = await refChild.once('value',(data)=>{
        let data1=data.val()

        if(data1==null)
        {
            count1='Data does not exist'
            return res.send('Data Does not exist ')

        }

        let keys = Object.keys(data1)

            for(let i=0;i<keys.length;i++)
            {
                let k=keys[i]
                let date = data1[k].date
                let member=data1[k].member
                let leaveUsed =data1[k].leaveUsed

                if(req.body.date1==req.body.date2)
                    count++

                if(date==req.body.date1)
                {
                    changeDate=date
                    changeMember=member
                    changeKey=k
                    changeLeaveUsed=leaveUsed
                    count++
                }

                if(date==req.body.date2)
                {
                    changedDate=date
                    changedMember=member
                    changedKey=k
                    changedLeaveUsed=leaveUsed
                    count++
                }
            }
    })

    if(count1==='Data does not exist')
    {
        return
    }


    if(count===2)
    {
        const swap = await node_client.db.ref('/user/data/'+finalDay+'/' + changeKey).update({member: changedMember,leaveUsed: changedLeaveUsed})
        const swap1 = await node_client.db.ref('/user/data/'+finalDay+'/' + changedKey).update({member: changeMember,leaveUsed:changeLeaveUsed})

        res.send('Replacement done')
    }

    else {

        res.send("Cannot Replace")
    }
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




// app.post('/api/holiday',(req,res)=>{
//     let dataFetched=[]
//     const userRef = node_client.ref.child('data/'+req.body.day)
//
//     userRef.once('value',(snapshot)=>{
//         let data1=snapshot.val()
//         if(data1==null)
//         {
//             count++;
//             return
//
//         }
//         const compOffCount=Object.values(compOffTest(req.body.day,req.body.member))
//         let keys = Object.keys(data1)
//         for(let i=0;i<keys.length;i++)
//         {
//             let k=keys[i]
//             let date = data1[k].date
//             let member=data1[k].member
//             let leaveUsed=data1[k].leaveUsed
//
//             if(compOffCount.length>0 )
//             {
//
//             }
//         }
//         const swap = node_client.db.ref('/user/data/'+req.body.day+'/' + k).update({member: changedMember,leaveUsed: changedLeaveUsed})
//     })
//
//
//     let promise = new Promise(function (resolve,reject) {
//
//
//
//     })
//
// })


app.post('/api/compOffCount',async (req,res)=>{
    const result =await compOffTest(req.body.day,req.body.member)
    let count=Object.values(result)

        res.send("Number of Comp Off leaves left :- "+count.length)


    })






app.listen(process.env.PORT || 3001,()=>{
    console.log(`Listening on port ${process.env.PORT}`)

})