

//Login form validation and handler
const loginUser = function(){
  userEmail = document.getElementById('userEmail').value;
  userPassword = document.getElementById('userPassword').value;
  if (userEmail == "" || userPassword == "") {
    demo.showNotification('bottom','center', 'warning', 'Enter email and password');
  }else{
    $.ajax({
      url: '/api/login',
      // dataType: "jsonp",
      data: {
        email: document.getElementById("userEmail").value,
        password: document.getElementById("userPassword").value
      },
      type: 'POST',
      success: function (data) {
        console.log(data);
        if(data.alert == 'true'){
          demo.showNotification('bottom','center', data.alertType, data.message);
        }
        if(data.alertType == 'success'){
          dashboard2000();
        }
      },
      error: function (status, error) {
        console.log('Error: ' + error.message);
      }
    });
  }
}


//Register form validation and handler
const registerUser = function(){
  username = document.getElementById('username').value;
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;
  confirmPassword = document.getElementById('confirmPassword').value;
  sponsorID = document.getElementById('sponsorID').value;

  if (email == "" || password == "" || confirmPassword == "" || sponsorID == "" || username == "") {
    demo.showNotification('bottom','center', 'warning', 'Please enter all the details');
  }else{
    $.ajax({
      url: '/api/register',
      // dataType: "jsonp",
      data: {
        email: email,
        password: password,
        username: username,
        confirmPassword: confirmPassword,
        sponsorID: sponsorID
      },
      type: 'POST',
      success: function (data) {
        if(data.alert == 'true'){
          demo.showNotification('bottom','center', data.alertType, data.message);
        }
        if(data.alertType == 'success'){
          login2000();
        }
      },
      error: function (status, error) {
        console.log('Error: ' + error.message);
      },
    });
  }
}


//Bank details updation form
const bankDetails = function(){
  holdersName = document.getElementById('holdersName').value
  accountNumber = document.getElementById('accountNumber').value
  bankName = document.getElementById('bankName').value
  ifsc = document.getElementById('ifsc').value

  $.ajax({
    url: '/api/bankDetails',
    // dataType: "jsonp",
    data: {
      holdersName: holdersName,
      accountNumber: accountNumber,
      bankName: bankName,
      ifsc: ifsc
    },
    type: 'POST',
    success: function (data) {
      if( data.redirect == undefined){

      }else{
        login2000();
      }
      if(data.alert == 'true'){
        demo.showNotification('bottom','center', data.alertType, data.message);
      }
      if(data.alertType == 'success'){
        document.getElementById('bankDetails').innerHTML = `
          <div class="card">
            <div class="card-header">
              <h5 class="title">Bank details</h5>
            </div>
            <div class="card-body">
                <div class="row">
                  <div class="col-md-5 pr-md-1">
                    <div class="form-group">
                      <label>Account Holder Name</label>
                      <input type="text" class="form-control" disabled="" placeholder="Name" value="`+data.bankDetails.name+`">
                    </div>
                  </div>
                  <div class="col-md-3 px-md-1">
                    <div class="form-group">
                      <label>Account Number</label>
                      <input type="text" class="form-control" disabled="" placeholder="Account Number" value="`+data.bankDetails.accountNumber+`">
                    </div>
                  </div>
                  <div class="col-md-3 px-md-1">
                    <div class="form-group">
                      <label>Bank name</label>
                      <input type="text" class="form-control" disabled="" placeholder="Bank name" value="`+data.bankDetails.bankName+`">
                    </div>
                  </div>
                  <div class="col-md-3 px-md-1">
                    <div class="form-group">
                      <label>IFSC code</label>
                      <input type="text" class="form-control" disabled="" placeholder="ifsc" value="`+data.bankDetails.ifsc+`">
                    </div>
                  </div>
                </div>
            </div>
          </div>
        `
      }
    },
    error: function (status, error) {
      console.log('Error: ' + error.message);
    },
  });


}

//Payment verification call
const paymentVerification = function(){

  amount = document.getElementById('amount').value
  trnxId = document.getElementById('trnxId').value
  tier = document.getElementById('tier').value
  $.ajax({
    url: '/api/paymentVerification',
    // dataType: "jsonp",
    data: {
      amount: amount,
      trnxId: trnxId,
      tier: tier
    },
    type: 'POST',
    success: function (data) {
      if( data.redirect == undefined){
        if(data.alert == 'true'){
          demo.showNotification('bottom','center', data.alertType, data.message);
        }
        if(data.alertType == 'success'){
         dashboard2000();
        }
      }else{
        login2000();
      }

    },
    error: function (status, error) {
      console.log('Error: ' + error.message);
    }
  });
}

//Withdraw button handler
const withdraw = function(){
  amount = document.getElementById('amount').value
  $.ajax({
    url: '/api/withdrawal',
    // dataType: "jsonp",
    data: {
      amount: amount
    },
    type: 'POST',
    success: function (data) {
      if( data.redirect == undefined){
        const availableBalance = function(){
          if(data.alert == 'true'){
            demo.showNotification('bottom','center', data.alertType, data.message);
          }
          document.getElementById('availableBalance').innerHTML = data.availableBalance
        }
        $( document ).ready(function() {
            availableBalance();
        });
      }else{
        login2000();
      }
    },
    error: function (status, error) {
        console.log('Error: ' + error.message);
    },
  });
}

const idActivateValidation = function(){
  const selectElement = document.getElementById('inputGroupSelect01')
  // Get the selected option
  var selectedOption = selectElement.options[selectElement.selectedIndex];

  // Get the id of the selected option
  var selectedId = selectedOption.id;
  $.ajax({
    url: '/idActivateValidation',
    type: 'POST',
    data:{
      email: document.getElementById('email').value,
      tier: selectedId,
      amount: document.getElementById('inputGroupSelect01').value
    },
    success: function(data){
      if( data.redirect == undefined){


         const contentToModal = function(){
           if(data.foundUser == "User not found"){

             document.getElementById('modalContent').innerHTML = `
               <div class="modal-header">
                 <h4 class=" fs-5" id="exampleModalLabel">Confirm Activation</h4>
               </div>
               <div class="modal-body text-center" id="modalBody">
                   <div class="mt-3 text-center">
                     <div class="text-center text-warning">
                       Email ID invalid!!
                     </div>
                   </div>
                   <div class="text-center mt-3">
                   </div>

               </div>
               <div class="modal-footer">
                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
               </div> `;

           }else{

             document.getElementById('modalContent').innerHTML = `
               <div class="modal-header">
                 <h4 class=" fs-5" id="exampleModalLabel">Confirm Activation</h4>
               </div>
               <div class="modal-body text-center" id="modalBody">
                   <div class="text-center">
                     <div class="my-3 mt-4">
                       <div class="row">
                         <div class="text-center col">
                           <h5 class="card-category">Email</h5>
                           <h5 class="card-title">${data.idUserEmail}</h5>
                         </div>
                       </div>
                       <br>
                       <div class="row">
                         <div class="text-center col">
                           <h5 class="text-end card-category">Tier</h5>
                           <h5 class="card-title text-success">${data.tier} - ${data.amount}</h5>
                         </div>
                         <div class="text-center col">
                           <h5 class="text-end card-category">Payable Amount</h5>
                           <h5 class="card-title">${data.amount}</h5>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div class="text-center mt-3">
                   </div>

               </div>
               <div class="modal-footer">
                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                 <button type="button" onclick="iDactivation()" data-bs-dismiss="modal" class="btn btn-primary active btn-simple text-center package-btn">Activate</button>
                 <!-- <button type="button" onclick="dailyTask()" id="dailyTask" disabled class="btn btn-primary" data-bs-dismiss="modal">Done</button> -->
               </div> `;
           }
         }

         $( document ).ready(function() {
             contentToModal();
         });

      }else{
        login2000();
      }

    },
    error: function (status, error) {
      console.log('Error: ' + error.message);
    },
  });
}

const iDactivation = function(){
  const selectElement = document.getElementById('inputGroupSelect01')
  // Get the selected option
  var selectedOption = selectElement.options[selectElement.selectedIndex];

  // Get the id of the selected option
  var selectedId = selectedOption.id;
  $.ajax({
    url: '/idActivation',
    type: 'POST',
    data:{
      email: document.getElementById('email').value,
      tier: selectedId,
      amount: document.getElementById('inputGroupSelect01').value
    },
    type: 'POST',
    success: function (data) {
      console.log(data);
      if( data.redirect == undefined){
        const availableBalance = function(){
          if(data.alert == 'true'){
            demo.showNotification('bottom','center', data.alertType, data.message);
          }
          document.getElementById('availableBalance').innerHTML = data.availableBalance
        }
        $( document ).ready(function() {
            availableBalance();
        });
      }else{
        login2000();
      }
    },
    error: function (status, error) {
        console.log('Error: ' + error.message);
    },
  });
}




var dashboard2000 = function(){
  setTimeout(function () {
    window.location.href = "/dashboard";
  }, 2000);
}
var login2000 = function(){
  setTimeout(function () {
    window.location.href = "/";
  }, 2000);
}
