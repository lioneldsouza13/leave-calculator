var names = ['1a', '2a', '3a', '4a', '5a', '6a'];
const months =['January','February','March','April','May','June','July','August','September','October','November','December']
const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
var day=6
let assigned = new Map([])
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

let count=0;
let holiday =0
let month = 7
    var d = new Date();
    var getTot = daysInMonth(month, d.getFullYear()); //Get total days in a month

    console.log(getTot)
    for (var i = 1; i <= getTot;i++) {    //looping through days in month
        var newDate = new Date(d.getFullYear(), month, i)
           holiday=newDate.getDate()+""+newDate.getMonth()
           console.log(holiday)
        if (newDate.getDay() === day && (holiday!=157 && holiday!=227)) {   //if Saturday
        
            var saturday=newDate.getDate() + ' ' + months[month] + ' ' + newDate.getFullYear()
            if(count===names.length)
            {

                count=0
                assigned.set(saturday,names[count])
                count++
                console.log(assigned)
            }
            else {

                assigned.set(saturday,names[count])
                console.log(assigned)
                count++
            }

        }

    }



