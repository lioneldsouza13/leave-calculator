const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')
const node_client = require('./node-client.js')
const saturday = require('./logic/saturdayCalculator')

const app =express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/api/store', (req, res) => {
    const userRef = node_client.ref.child('data');
    userRef.once("value")
        .then(function (snapshot) {
            let fetchData = snapshot.val();  // true

            if (fetchData !== null) {
                res.send('Data already exist')

            }
            else {

                for (let data of saturday.test(req.body)) {
                    let storeData = {date: data[0], member: data[1] }
                    userRef.push(storeData)
                }
                res.send('Data Saved in Database')
            }
        });
})

app.get('/api/delete', (req, res) => {
    const userRef = node_client.ref.child('data');
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



app.listen(process.env.PORT || 3001,()=>{
    console.log(`Listening on port ${process.env.PORT}`)

})