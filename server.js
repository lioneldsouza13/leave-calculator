const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const node_client = require('./node-client.js')
const saturday = require('./logic/saturdayCalculator')
//const path = require('path')
const app =express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get('/api/store',(req,res)=>{
   const userRef = node_client.ref.child('data');


    userRef.once("value")
        .then(function(snapshot) {
            let a = snapshot.val();  // true
            console.log(req.body)
            if(a!==null)
            {
                res.send('child exist')
                return
            }
            else {
                console.log(req.body)
                for(let test of saturday.test(req.body))
                {

                    userRef.push(
                        test
                    )


                }


                res.send('Saved')
            }


        });



})

app.get('/api/delete',(req,res)=>{
    userRef = node_client.ref.child('data');
    userRef.remove()
    res.send('deleted')
})


//
// app.post('/api/test',(req,res)=>{
//
//     const userRef = node_client.ref.child('user '+req.body.id);
//     userRef.set(
//         {
//
//             name:req.body.name
//         }
//
//     )
//    res.status(200).send('worked');
//
// })


// app.post('/api/fetch',async (req,res)=>{
//   const test =await   node_client.ref.once('child_added',function (snapshot) {
//     var data1=''
//         snapshot.forEach(function(data) {
//             console.log("The " + data.key + " dinosaur's score is " + data.val());
//             data1=data1+data.val();
//         });
//
//        res.status(200).send(data1);
//     })
// })

app.post('/api/fetchAll',async (req,res)=>{
    var data1=[];
    const test = await node_client.ref.once('value',function (snapshot) {
        snapshot.forEach(function(data) {
            // console.log("The " + data.key + " name is " + data.val());
            data.forEach((u)=>{


                data1.push(u.val());
            })

        });
    })

  //  console.log(data1[0])
    res.status(200).send(data1);

})


app.listen(3001,()=>{
    console.log(`Listening on port 3001`)

})