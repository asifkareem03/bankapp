var person1={ acno: 1001, name:'Ravi', ac_type:"Savings", balance: 2000,password: "userone"};
var person2={ acno: 1002, name:'Nikhil', ac_type:"Savings", balance: 3000,password: "usertwo"};
localStorage.setItem(person1.acno,JSON.stringify(person1));
localStorage.setItem(person2.acno,JSON.stringify(person2));
class Bank{
    fillaccno()
    {
        document.getElementById("blankMsg").innerHTML ='';
        document.getElementById("typeMsg").innerHTML = "";
        document.getElementById("bal_message").innerHTML ='';
        document.getElementById("message1").innerHTML ='';
        document.getElementById("message2").innerHTML ='';
        document.getElementById("New_account_creation").reset();
    
        let le=Object.keys(localStorage).length;
        let last_key=Object.keys(localStorage)[le-1];
        let new_ac_no=Number(last_key)+1;
        document.getElementById("new_accountNumber").value=new_ac_no;
    }

    create_new_account() 
    {
        var form = document.getElementById("New_account_creation");
        var acno=form[0].value;
        var ac_name = form[1].value.trim();
        var ac_type=form[2].value;
        var bal=form[3].value;
        var pw1 = form[4].value;
        var pw2 = form[5].value;
    
        //check empty first name field
        // if (ac_name == "") {
        //     document.getElementById("blankMsg").innerHTML = "**Fill the first name";
        //     return false;
        // }
        //Name validation(Checks Empty or not and contains only characters)
        var Regex=/^[a-zA-Z ]+$/;
        if(!Regex.test(ac_name))
        {
            document.getElementById("blankMsg").innerHTML = "**Please Enter a proper Name";
            return false;
        }
        document.getElementById("blankMsg").innerHTML =''
    
        //account type validation
        if(ac_type!='Savings' && ac_type!='Current'){
            document.getElementById("typeMsg").innerHTML = "**Please Select account type";
            return false;
        }
        document.getElementById("typeMsg").innerHTML = ''
    
        // if(bal==""){
        //     document.getElementById("bal_message").innerHTML = "**Please Select account type";
        //     return false;
        // }
        var isNumber = /^\d*\.?\d+$/
        if(!isNumber.test(bal)){
            document.getElementById("bal_message").innerHTML = "**Please Enter a Proper Balance";
            return false;
        }
        document.getElementById("bal_message").innerHTML =''
    
        //check empty password field
        if (pw1 == "") {
            document.getElementById("message1").innerHTML = "**Fill the password please!";
            return false;
        }
        document.getElementById("message1").innerHTML =''
    
        //check empty confirm password field
        if (pw2 == "") {
            document.getElementById("message2").innerHTML = "**Enter the password please!";
            return false;
        }
        document.getElementById("message2").innerHTML ='';
    
        if (pw1 != pw2) {
            document.getElementById("message2").innerHTML = "**Passwords are not same";
            return false;
        } 
        else {
            document.getElementById("message2").innerHTML ='';
            let user={ acno: acno, name:ac_name, ac_type:ac_type, balance:bal,password:pw2};
            localStorage.setItem(acno,JSON.stringify(user));
            alert("Successfully Created the account");
            document.getElementById("New_account_creation").action="./index.html";
            return true;
            // location.href="./userhome.html";
            // account_details[acno] = { acno: acno, name:ac_name, ac_type:ac_type, balance:bal,password:pw2};
            // console.log(account_details);
            //   document.write("JavaScript form has been submitted successfully");
        }
    
    }

    authenticate(){
        let account_number=acc_number.value;
        let password=acc_password.value;
        let captcha=mainCaptcha.value;
        let typed_captcha=input_captcha.value;

        if(account_number==''){
            document.getElementById("error-msg").innerHTML="Please Enter Account Number";
            // document.getElementById("error-msg").style.display="block";
            return false;
        }
        if(password==''){
            document.getElementById("error-msg").innerHTML="Please Enter Password";
            return false;
        }
        if(typed_captcha==''){
            document.getElementById("error-msg").innerHTML="Please Enter the Captcha";
            return false;
        }
        document.getElementById("error-msg").innerHTML='';
        if(account_number in localStorage){ 
            let user=JSON.parse(localStorage.getItem(account_number));
            captcha=captcha.replace(/ /g, "")
            typed_captcha=typed_captcha.replace(/ /g, "")
            if(captcha!=typed_captcha){
                document.getElementById("error-msg").innerHTML="Entered Captcha is Wrong";
                return false;
            }
            if(account_number!=user.acno || password!=user.password){
                document.getElementById("error-msg").innerHTML="Invalid credentials";
                return false;
            }
            else{
                document.getElementById("error-msg").innerHTML="";
                sessionStorage.setItem(account_number,JSON.stringify(user));
                document.getElementById("login-form").action="./userhome.html";
                return true;
            }
        }
        else{
            document.getElementById("error-msg").innerHTML="Invalid credentials";
            return false;
        }
    
    }

    transfer(){
        let user=JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage)[0]));
        let acc_no=document.getElementById("ben-accno").value;
        let amount=document.getElementById("trans-amount").value;
        if(acc_no==''){
            document.getElementById("ben-accno-msg").innerHTML="Please Enter a Beneficiary Account Number";
            return false;
        }
        document.getElementById("ben-accno-msg").innerHTML="";
        var isNumber = /^\d*\.?\d+$/
        if(!isNumber.test(amount)){
            document.getElementById("trans-amount-msg").innerHTML="Please Enter Transfer Amount";
            return false;
        }
        document.getElementById("trans-amount-msg").innerHTML="";
        if(acc_no==user.acno){
            document.getElementById("ben-accno-msg").innerHTML="Fund Transfer is not possible to Same Account";
            return false;
        }
        document.getElementById("ben-accno-msg").innerHTML="";
        if(acc_no in localStorage){
            if(user.balance>=amount){
                let benef=JSON.parse(localStorage.getItem(acc_no));
                benef.balance+=Number(amount);
                user.balance-=Number(amount);
                localStorage.setItem(acc_no,JSON.stringify(benef));
                localStorage.setItem(user.acno,JSON.stringify(user));
                sessionStorage.setItem(user.acno,JSON.stringify(user));
                alert("Successfully transfered");
                document.getElementById("f-tran").click();
                document.getElementById("f-tran").focus();
            }
            else{
                document.getElementById("trans-amount-msg").innerHTML="Insufficient-Balance";
                return false;
            }
        }
        else{
            document.getElementById("ben-accno-msg").innerHTML="Beneficiary Account Number is wrong";
            return false;
        }
    }


}
let bank=new Bank();

function logout(){
    sessionStorage.clear();
    location.href="./index.html"
}

function Captcha() {
    // var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
    // var i;
    // for (i = 0; i < 9; i++) {
    //     var a = alpha[Math.floor(Math.random() * alpha.length)];
    //     var b = alpha[Math.floor(Math.random() * alpha.length)];
    //     var c = alpha[Math.floor(Math.random() * alpha.length)];
    //     var d = Math.ceil(Math.random() * 9) + '';
    //     var e = Math.ceil(Math.random() * 9) + '';
    //     var f = Math.ceil(Math.random() * 9) + '';
    // }
    // var code = a + ' ' + b + ' ' + c + ' ' + d + ' ' + e + ' ' + f;
    // code = shuffle(code)

    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var captchaLength = 6;
    var captcha = '';

    for (var i = 0; i < captchaLength; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        captcha += characters[randomIndex];
    }

    captcha = insertSpaces(captcha);
    document.getElementById("mainCaptcha").value = captcha;
}

function insertSpaces(text) {
    return text.split('').join(' ');
}
// function Toggle() {
//     var temp = document.getElementById("");
//     if (temp.type === "password") {
//         temp.type = "text";
//     }
//     else {
//         temp.type = "password";
//     }
// }
function account_summary(){
    setActiveSidebar();
    blocking();
    document.getElementById('accnt-details').style.display="block";
    let user=JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage)[0]))
    document.getElementById('td-name').innerHTML=user.name;
    document.getElementById('td-acno').innerHTML=user.acno;
    document.getElementById('td-actype').innerHTML=user.ac_type;
}

function view_balance(){
    blocking();
    document.getElementById('view-balance').style.display="block";
    let user=JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage)[0]))
    document.getElementById('blnc-ac-name').innerHTML=user.name;
    document.getElementById('blnc-ac-number').innerHTML=user.acno;
    document.getElementById('blnc-ac-type').innerHTML=user.ac_type;
    document.getElementById('blnc-ac-balance').innerHTML=user.balance;
}

function fund_transfer(){
    let user=JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage)[0]))
    document.getElementById("ben-accno").value="";
    document.getElementById("trans-amount").value="";
    blocking();
    document.getElementById("user-balance").value=user.balance;
    document.getElementById('fund-transfer').style.display="block";
}
function transcations(){
    blocking()
    document.getElementById('except').style.display="block";
    alert('This Feature Will Come soon');
}
function loans(){
    blocking()
    document.getElementById('except').style.display="block";
    alert('This Feature Will Come soon');
}
function cards(){
    blocking()
    document.getElementById('except').style.display="block";
    alert('This Feature Will Come soon');
}
function change_password_div(){
    blocking();
    document.getElementById('change_psswrd').style.display="block";
    document.getElementById('chng-pswrd').focus();
}
function change_password(){
    if(current_pwd.value==''){
        document.getElementById("current-pwd-msg").innerHTML="Please Enter the current password";
        return false;
    }
    // document.getElementById("current-pwd").innerHTML=""
    if(new_pwd.value==''){
        document.getElementById("new-pwd-msg").innerHTML="Please Enter the new password";
        return false;
    }
    // document.getElementById("new-pwd-msg").innerHTML="";
    if(confirm_pwd.value==''){
        document.getElementById("confirm-pwd-msg").innerHTML="Please confirm the new password";
        return false;
    }
    // document.getElementById("confirm-pwd-msg").innerHTML="";
    let user=JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage)[0]));
    if(current_pwd.value!=user.password){
        document.getElementById("current-pwd-msg").innerHTML="Current password is wrong";
        return false;
    }
    if(new_pwd.value!=confirm_pwd.value){
        document.getElementById("confirm-pwd-msg").innerHTML="both passwords should be same";
        return false;
    }
    else{
        // let user=JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage)[0]));
        let user=JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage)[0]));
        user.password=document.getElementById("confirm_pwd").value;
        localStorage.setItem(user.acno,JSON.stringify(user));
        alert("succesfull.Please login again");
        logout();
    }
}
// function shuffle(s) {
//     var arr = s.split('');           // Convert String to array
//     var n = arr.length;              // Length of the array

//     for (var i = n - 1; i > 0; i--) {
//         var j = Math.floor(Math.random() * (i + 1));
//         var tmp = arr[i];
//         arr[i] = arr[j];
//         arr[j] = tmp;
//     }
//     s = arr.join('');                // Convert Array to string
//     return s;                        // Return shuffled string
// }


function check(){
    document.body.innerHTML='';
    document.body.style.backgroundColor='white';
    alert("please login");
    location.href="./index.html"
}
function blocking(){
    document.getElementById('accnt-details').style.display="none";
    document.getElementById('view-balance').style.display="none";
    document.getElementById('fund-transfer').style.display="none";
    document.getElementById('except').style.display="none";
    document.getElementById('change_psswrd').style.display="none";
}

function rem(){
    document.getElementById("ben-accno-msg").innerHTML="";
    document.getElementById("trans-amount-msg").innerHTML="";
}
function remve(){
    document.getElementById("current-pwd-msg").innerHTML="";
    document.getElementById("new-pwd-msg").innerHTML="";
    document.getElementById("confirm-pwd-msg").innerHTML="";
}
function setActiveSidebar() {
    
// Get all sidebar items
    var sidebarItems = document.querySelectorAll('.side-item');
    console.log(sidebarItems)

    // Add click event listener to each sidebar item
    sidebarItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // Remove the 'active' class from all sidebar items
            sidebarItems.forEach(function(item) {
                item.classList.remove('active');
            });

            // Add the 'active' class to the clicked sidebar item
            item.classList.add('active');
        });
    });
}