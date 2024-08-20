const amountValidaion = function(){
  let amount = document.getElementById('amount').value;
  let availableBalance = Number(document.getElementById('availableBalance').innerHTML);
  let bankDetails = document.getElementById('bankDetails').innerHTML;
   // Checking for Minimal Withdrawal
   if (amount <149){
     setTimeout(function(){
       document.getElementById("validater").innerHTML = `Amount is below minimmum withdrawal`
       document.getElementById("validater").style.display = "block";
     }, 200);
     validationTrue()
   }else{
     // Checking for available BALANCE
     if(amount>availableBalance){
       setTimeout(function(){
         document.getElementById("validater").innerHTML = `Low balance`
         document.getElementById("validater").style.display = "block";
       }, 200);
       validationTrue();
     }else{
       if(bankDetails == "Not provided"){
         // Checking for Bank details
         setTimeout(function(){
           document.getElementById("validater").innerHTML = `Enter Bank details to withdraw`
           document.getElementById("validater").style.display = "block";
         }, 200);
         validationTrue()
       }else{
         setTimeout(function(){
           document.getElementById("validater").innerHTML = ``
           document.getElementById("validater").style.display = "hidden";
         }, 200);
         validationFalse()
       }
     }
   }

}

const validationTrue = function(){
  var $withdrawalSubmit = $('#withdrawalSubmit');
  setTimeout(function(){
    document.getElementById("withdrawalSubmit").disabled = true;
    $withdrawalSubmit.removeClass('active');
  }, 500);
}

const validationFalse = function(){
  var $withdrawalSubmit = $('#withdrawalSubmit');
  setTimeout(function(){
    document.getElementById("withdrawalSubmit").disabled = false;
    $withdrawalSubmit.addClass('active');
  }, 500);
}

const emailValidaion = function(){

  let availableBalance = Number(document.getElementById('availableBalance').innerHTML);
  let inputGroupSelect01 = document.getElementById('inputGroupSelect01').value;
  let email = document.getElementById('email').value;


   if(availableBalance< inputGroupSelect01 && email != ''){
     setTimeout(function(){
       document.getElementById("validater").innerHTML = `Low balance, you do not have sufficient balance`
       document.getElementById("validater").style.display = "block";
     }, 200);
     validateTrue();
   }else{
     if(availableBalance < inputGroupSelect01 && email == ''){
       setTimeout(function(){
         document.getElementById("validater").innerHTML = `Kindly fill in all of the required fields`
         document.getElementById("validater").style.display = "block";
       }, 200);
       validateTrue();
     }else{
       if(availableBalance > inputGroupSelect01 && email == ''){
         setTimeout(function(){
           document.getElementById("validater").innerHTML = `Kindly fill in all of the required fields`
           document.getElementById("validater").style.display = "block";
         }, 200);
         validateTrue();
       }else{
           setTimeout(function(){
             document.getElementById("validater").innerHTML = ``
             document.getElementById("validater").style.display = "hidden";
           }, 200);
           validateFalse();
       }
     }
   }

}

const validateTrue = function(){
  var $idActivation = $('#idActivation');
  setTimeout(function(){
    document.getElementById("idActivation").disabled = true;
    $idActivation.removeClass('active');
  }, 500);
}

const validateFalse = function(){
  var $idActivation = $('#idActivation');
  setTimeout(function(){
    document.getElementById("idActivation").disabled = false;
    $idActivation.addClass('active');
  }, 500);
}


// Function for transaction Modal popup

const modalBody = function(clickedButton){
    const trnxID =  clickedButton.id;
    $.ajax({
      url: '/api/transactionID/'+trnxID,
      type: 'GET',
      success: function (data) {
        if( data.redirect == undefined){
              if(data.foundTransaction.type == "Credit"){
                if(data.foundTransaction.from == "Invested" ||data.foundTransaction.from == "Withdraw" || data.foundTransaction.from == "Daily Task" || data.foundTransaction.from == "Club Earnings"){
                  document.getElementById('modalBody').innerHTML =
                  `<div class="row">                  
                  <div class="text-center col">
                  <h5 class="card-category">Transaction</h5>
                  <h4 class="card-title">`+data.foundTransaction.from+`</h4>
                  </div>
                  <div class="text-center col">
                  <h5 class="text-end card-category">Amount</h5>
                  <h4 class="card-title text-success">+`+data.foundTransaction.amount+`</h4>
                  </div>
                  </div>
                  <hr class="horizontal">
                  <div class="row">
                  <div class="text-center col">
                  <h5 class="card-category">Date</h5>
                  <h4 class="card-title">`+data.foundTransaction.time.date+`/`+data.foundTransaction.time.month+`/`+data.foundTransaction.time.year+`</h4>
                  </div>
                  <div class="text-center col">
                  <h5 class="text-end card-category">Transaction ID</h5>
                  <h4 class="card-title">`+data.foundTransaction.trnxId+`</h4>
                  </div>
                  </div>`
                }else{
                  document.getElementById('modalBody').innerHTML =
                  `<div class="row">
                    <div class="text-center col">
                      <h5 class="card-category">Transaction</h5>
                      <h4 class="card-title">`+data.foundTransaction.userID+`</h4>
                    </div>
                    <div class="text-center col">
                      <h5 class="text-end card-category">Amount</h5>
                      <h4 class="card-title text-success">+`+data.foundTransaction.amount+`</h4>
                    </div>
                  </div>
                  <hr class="horizontal">
                  <div class="row">
                    <div class="text-center col">
                      <h5 class="card-category">Date</h5>
                      <h4 class="card-title">`+data.foundTransaction.time.date+`/`+data.foundTransaction.time.month+`/`+data.foundTransaction.time.year+`</h4>
                    </div>
                    <div class="text-center col">
                      <h5 class="text-end card-category">Transaction ID</h5>
                      <h4 class="card-title">`+data.foundTransaction.trnxId+`</h4>
                    </div>
                  </div>`
                }
            }else{
              document.getElementById('modalBody').innerHTML =
              `<div class="row">
                <div class="text-center col">
                  <h5 class="card-category">Transaction</h5>
                  <h4 class="card-title">`+data.foundTransaction.from+`</h4>
                </div>
                <div class="text-center col">
                  <h5 class="text-end card-category">Amount</h5>
                  <h4 class="card-title text-danger">-`+data.foundTransaction.amount+`</h4>
                </div>
              </div>
              <hr class="horizontal">
              <div class="row">
                <div class="text-center col">
                  <h5 class="card-category">Date</h5>
                  <h4 class="card-title">`+data.foundTransaction.time.date+`/`+data.foundTransaction.time.month+`/`+data.foundTransaction.time.year+`</h4>
                </div>
                <div class="text-center col">
                  <h5 class="text-end card-category">Transaction ID</h5>
                  <h4 class="card-title">`+data.foundTransaction.trnxId+`</h4>
                </div>
              </div>`
            }
        }else{
          login2000();
        }

      },
      error: function (status, error) {
        console.log('Error: ' + error.message);
      },
    });
  }
