const node_client = require('./../node-client.js')
module.exports = async function(day,member) {
    //console.log(day+" "+member)
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    let today = new Date();
    let currDate = today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear();

    let dataFetched = [];
    let count = 0
    const userRef = node_client.ref.child('data/' + day)

    const test1 = await
    userRef.once('value', (snapshot) => {
        let data1 = snapshot.val()
        if (data1 == null) {
            count++;
            return

        }

        let keys = Object.keys(data1)
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i]
            let date = data1[k].date
            let member = data1[k].member
            let leaveUsed = data1[k].leaveUsed

            dataFetched.push({
                date: date,
                member: member,
                leaveUsed: leaveUsed
            })

        }
    })

    let currDate1 = new Date(currDate)

    function filterByID(item) {
        let date1 = Date.parse(item.date)

        if (date1 < currDate1 && item.member === member && item.leaveUsed === 'No') {
            return true
        }

        return false;
    }


    let filteredItems = await dataFetched.filter(filterByID)
    return filteredItems
   // console.log(filteredItems +" test")
   //  let promise = new Promise(function (resolve, reject) {
   //
   //      if (count === 1)
   //         return reject('Some Error occurred')
   //      else
   //         return resolve(filteredItems)
   //  })
   //
   //
   //  const test = await
   //  promise.then((result) => {
   //         console.log(result)
   //      return "Number of comp off leaves left " + result.length
   //  }).catch((result) => {
   //
   //      return (result)
   //  })

}