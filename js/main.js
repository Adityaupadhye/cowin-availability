const pinField=document.getElementById('pinField');
const dateField=document.getElementById('dateField');
const errorField=document.getElementById('error');
const errorDate=document.getElementById('errorDate');
const resField=document.getElementById('res');
const table=document.getElementById('tbody');
const loader=document.getElementById('loader');

var array=[];

window.onload=function(){
    loader.style.display="none";
    console.log('window loaded');
}

function getData(pin, date) {
    var http=new XMLHttpRequest();
    split=date.split('-');
    date=split[2]+'-'+split[1]+'-'+split[0];

    var API_URL='https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode='+pin+'&date='+date;
    
    //console.log(API_URL);
    showLoader();
    http.open('GET', API_URL, true);
    http.send();

    http.onreadystatechange= function(){
        if(this.readyState==4 && this.status==200){
            hideLoader();
            res=http.response;
            res=JSON.parse(res);
            console.log(typeof(res));
            fillArray(res);
            
            var centers=res['centers'];

            if(centers.length == 0){
                resField.innerHTML='No Appointments available';
                return;
            }
        }
    }

    http.onerror=function(){
        hideLoader();
        resField.innerHTML="Something went wrong please try again";
        return;
    }

    http.ontimeout=function(){
        hideLoader();
        resField.innerHTML="Connection timeout";
    }

}

function fillArray(data){
    var centers=data['centers'];
    var obj={
        'name':'',
        'appointments':0,
        'minAge':0
    };

    for(var center of centers){
        //console.log(center);
        obj['name']=center['name'];
        var sessions=center['sessions'];
        if(sessions.length!=0){
            for(var session of sessions){
                obj['appointments']=session['available_capacity'];
                obj['minAge']=session['min_age_limit'];
            }
        }
        //console.log(obj);
        fillTable(obj);
        //array.push(obj);
    }
    //console.log(array, obj);

}

function fillTable(data){
    var table=document.getElementById('tbody');
    var row=`
            <tr>
                <td>${data.name}</td>
                <td>${data.appointments}</td>
                <td>${data.minAge}</td>
            </tr>
        `;
    table.innerHTML+=row;
}

function formSubmit(){
    var pin=pinField.value;
    var date=dateField.value;
    if(pin.length<6){
        errorField.innerHTML="PIN Code should be 6 digits";
        return;
    }
    if(!validatePin(pin)){
        errorField.innerHTML="Enter a valid PIN code";
        return;
    }
    errorField.innerHTML="";
    if(date.length<10){
        errorDate.innerHTML="Enter a valid date";
        return;
    }
    errorDate.innerHTML="";

    console.log(pin, date);
    table.innerHTML='';
    resField.innerHTML='';
    getData(pin, date);
}

function resetAll(){
    pinField.value='';
    dateField.value='';
    resField.innerHTML='';
    errorDate.innerHTML='';
    errorField.innerHTML='';
    table.innerHTML='';
}

function validatePin(pin){
    console.log('called');
    for(let letter of pin){
        var ascii_val=letter.charCodeAt(0);
        console.log(ascii_val);
        if(ascii_val>57 || ascii_val<48){
            console.log('return false');
            return false;
        }
    }
    return true;
}

function showLoader(){
    loader.style.display="block";
}

function hideLoader(){
    loader.style.display="none";
}