
 module.exports.test= function(names)
 {
     if(names==null || names.length===0) {
         names = ['1a', '2a', '3a', '4a', '5a', '6a'];
     }
     const months =['January','February','March','April','May','June','July','August','September','October','November','December']


     let assigned = new Map([])




     function daysInMonth(month, year) {
         return new Date(year, month, 0).getDate();
     }

     let count=0;
     for(var k=0;k<12;k++) {
         var d = new Date();
         var getTot = daysInMonth(k, d.getFullYear()); //Get total days in a month

         for (var i = 1; i <= getTot;i++) {    //looping through days in month
             var newDate = new Date(d.getFullYear(), k, i)

             if (newDate.getDay() == 6) {   //if Saturday


                 var saturday=newDate.getDate() + ' ' + months[k] + ' ' + newDate.getFullYear()


                 if(count===names.length)
                 {

                     count=0
                     assigned.set(saturday,names[count])
                     count++

                 }
                 else {

                     assigned.set(saturday,names[count])

                     count++
                 }




             }


         }


     }

return assigned



     // for(let amount of assigned )
     // {
     //     console.log(amount)
     // }


 }

