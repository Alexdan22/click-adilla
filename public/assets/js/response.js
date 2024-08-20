const profile = function(){
    var $toggle = $('.navbar-toggle');
    if (blackDashboard.misc.navbar_menu_visible == 1) {
      $html.removeClass('nav-open');
      blackDashboard.misc.navbar_menu_visible = 0;
      setTimeout(function() {
        $toggle.removeClass('toggled');
        $('.bodyClick').remove();
      }, 550);

    } else {
      setTimeout(function() {
        $toggle.addClass('toggled');
      }, 580);

      var div = '<div class="bodyClick"></div>';
      $(div).appendTo('body').click(function() {
        $html.removeClass('nav-open');
        blackDashboard.misc.navbar_menu_visible = 0;
        setTimeout(function() {
          $toggle.removeClass('toggled');
          $('.bodyClick').remove();
        }, 550);
      });

      $html.addClass('nav-open');
      blackDashboard.misc.navbar_menu_visible = 1;
  }

  $.ajax({
    url: '/profile',
    type: 'GET',
    success: function (data) {

      if( data.redirect == undefined){

        const contentToProfile = function(){
          if(data.sponsorID == "Not found"){
            document.getElementById('content').innerHTML = `
            <div class="row">
              <div class="col-md-4">
                <div class="card card-user">
                  <div class="card-body">
                    <div class="card-text">
                      <div class="author">
                        <div class="block block-one"></div>
                        <div class="block block-two"></div>
                        <div class="block block-three"></div>
                        <div class="block block-four"></div>
                        <a href="javascript:void(0)">
                          <img class="avatar" src="../assets/img/user_icon.png" alt="...">
                          <h5 class="title">`+data.username+`</h5>
                        </a>
                        <p class="description">
                          `+data.userID+`
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <div class="button-container">
                      <button type="button"  class="btn btn-icon btn-round btn-facebook">
                      <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://adsweekly.onrender.com/register/`+data.userID+`">
                      <i class="fab text-info fa-facebook"></i>
                      </a>
                      </button>
                      <button type="button"  class="btn btn-icon btn-round btn-twitter">
                        <a target="_blank" href="https://twitter.com/intent/tweet?url=https://adsweekly.onrender.com/register/`+data.userID+`" class="">
                          <i class="fab text-info fa-twitter"></i>
                        </a>
                      </button>
                      <button type="button"  class="btn btn-icon btn-round btn-google">
                      <a target="_blank" href="https://api.whatsapp.com/send?text=https://adsweekly.onrender.com/register/`+data.userID+`" class="">
                        <i class="fab text-success fa-whatsapp"></i>
                      </a>
                      </button>
                        <div class="text-center">
                          <h5 class="text-sm text-center text-secondary">Refer Now</h5>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
                <div class="col-md-8">
                  <div class="card">
                    <div class="card-header">
                      <h5 class="title">Personal Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                          <div class="col-md-5 pr-md-1">
                            <div class="form-group">
                              <label>Email</label>
                              <input type="email" class="form-control" disabled="" placeholder="Email" value="`+data.email+`">
                            </div>
                          </div>
                          <div class="col-md-3 px-md-1">
                            <div class="form-group">
                              <label>Sponsored By</label>
                              <input type="text" class="form-control" disabled="" placeholder="Sponsored By" value="`+data.sponsorID+`">
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div id="bankDetails">
                  </div>
                </div>
            </div>
            `;
          }else{
            document.getElementById('content').innerHTML = `
            <div class="row">
              <div class="col-md-4">
                <div class="card card-user">
                  <div class="card-body">
                    <div class="card-text">
                      <div class="author">
                        <div class="block block-one"></div>
                        <div class="block block-two"></div>
                        <div class="block block-three"></div>
                        <div class="block block-four"></div>
                        <a href="javascript:void(0)">
                          <img class="avatar" src="../assets/img/user_icon.png" alt="...">
                          <h5 class="title">`+data.username+`</h5>
                        </a>
                        <p class="description">
                          `+data.userID+`
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <div class="button-container">
                      <button type="button"  class="btn btn-icon btn-round btn-facebook">
                      <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://adsweekly.onrender.com/register/`+data.userID+`">
                      <i class="fab text-info fa-facebook"></i>
                      </a>
                      </button>
                      <button type="button"  class="btn btn-icon btn-round btn-twitter">
                        <a target="_blank" href="https://twitter.com/intent/tweet?url=https://adsweekly.onrender.com/register/`+data.userID+`" class="">
                          <i class="fab text-info fa-twitter"></i>
                        </a>
                      </button>
                      <button type="button"  class="btn btn-icon btn-round btn-google">
                      <a target="_blank" href="https://api.whatsapp.com/send?text=https://adsweekly.onrender.com/register/`+data.userID+`" class="">
                        <i class="fab text-success fa-whatsapp"></i>
                      </a>
                      </button>
                        <div class="text-center">
                          <h5 class="text-sm text-center text-secondary">Refer Now</h5>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
                <div class="col-md-8">
                  <div class="card">
                    <div class="card-header">
                      <h5 class="title">Personal Information</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                          <div class="col-md-5 pr-md-1">
                            <div class="form-group">
                              <label>Email</label>
                              <input type="email" class="form-control" disabled="" placeholder="Email" value="`+data.email+`">
                            </div>
                          </div>
                          <div class="col-md-3 px-md-1">
                            <div class="form-group">
                              <label>Sponsored By</label>
                              <input type="text" class="form-control" disabled="" placeholder="Sponsored By" value="`+data.sponsorID+` - `+data.sponsorName+`">
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div id="bankDetails">
                  </div>
                </div>
            </div>
            `;
          }

        }

        const navbarToProfile = function(){
          document.getElementById('dashboard').innerHTML = `
          <div class="navbar-toggle d-inline">
            <button type="button" class="navbar-toggler">
              <span class="navbar-toggler-bar bar1"></span>
              <span class="navbar-toggler-bar bar2"></span>
              <span class="navbar-toggler-bar bar3"></span>
            </button>
          </div>
          <a class="navbar-brand" href="javascript:void(0)">Profile</a>
          `;

        }

        const sidebarToProfile = function(){
          document.getElementById('sidebar').innerHTML = `
          <div class="sidebar-wrapper">
            <div class="logo">
              <a href="javascript:void(0)" class="simple-text logo-mini">
                ADs
              </a>
              <a href="javascript:void(0)" class="simple-text logo-normal">
                Weekly
              </a>
            </div>
            <ul class="nav" id="nav-bar">
              <li>
                <a href="javascript:dashboard()" class="dashboard">
                  <i class="tim-icons icon-chart-pie-36"></i>
                  <p>Dashboard</p>
                </a>
              </li>
              <li class="active ">
                <a href="javascript:profile()" class="profile">
                  <i class="tim-icons icon-single-02"></i>
                  <p class="profile">profile</p>
                </a>
              </li>
              <li>
                <a href="javascript:package()">
                  <i class="tim-icons icon-atom"></i>
                  <p>Package</p>
                </a>
              </li>
              <li>
                <a href="javascript:withdrawal()">
                  <i class="tim-icons icon-money-coins"></i>
                  <p>Withdrawal</p>
                </a>
              </li>
              <li>
                <a href="javascript:transaction()">
                  <i class="tim-icons icon-align-left-2"></i>
                  <p>Transaction</p>
                </a>
              </li>
            </ul>
          </div>
          `;
        }

        const bankToProfile = function(){
          if(data.bank == true){
            console.log(data.bankDetails);
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
          }else{
            document.getElementById('bankDetails').innerHTML = `
              <div class="card">
                <div class="card-header">
                  <h5 class="title">Enter Bank details</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                      <div class="col-md-5 pr-md-1">
                        <div class="form-group">
                          <label>Account Holder Name</label>
                          <input type="text" class="form-control" id="holdersName" name="holdersName" placeholder="Name">
                        </div>
                      </div>
                      <div class="col-md-3 px-md-1">
                        <div class="form-group">
                          <label>Account Number</label>
                          <input type="text" class="form-control" id="accountNumber" name="accountNumber" placeholder="Account Number">
                        </div>
                      </div>
                      <div class="col-md-3 px-md-1">
                        <div class="form-group">
                          <label>Bank name</label>
                          <input type="text" class="form-control" id="bankName" name="bankName" placeholder="Bank name">
                        </div>
                      </div>
                      <div class="col-md-3 px-md-1">
                        <div class="form-group">
                          <label>IFSC code</label>
                          <input type="text" class="form-control" id="ifsc" name="ifsc" placeholder="ifsc">
                        </div>
                      </div>
                    </div>
                    <div class="card-footer">
                      <button onclick="bankDetails()" class="btn btn-fill btn-success">Submit</button>
                    </div>
                </div>
              </div>
            `
          }

        }

        $( document ).ready(function() {
            navbarToProfile();
        });
        $( document ).ready(function() {
            sidebarToProfile();
        });
        $( document ).ready(function() {
            contentToProfile();
        });
        $( document ).ready(function() {
            bankToProfile();
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

const profilePage = function(){

    $.ajax({
      url: '/profile',
      type: 'GET',
      success: function (data) {
        if( data.redirect == undefined){

        const contentToProfile = function(){
                    if(data.sponsorID == "Not found"){
                      document.getElementById('content').innerHTML = `
                      <div class="row">
                        <div class="col-md-4">
                          <div class="card card-user">
                            <div class="card-body">
                              <div class="card-text">
                                <div class="author">
                                  <div class="block block-one"></div>
                                  <div class="block block-two"></div>
                                  <div class="block block-three"></div>
                                  <div class="block block-four"></div>
                                  <a href="javascript:void(0)">
                                    <img class="avatar" src="../assets/img/user_icon.png" alt="...">
                                    <h5 class="title">`+data.username+`</h5>
                                  </a>
                                  <p class="description">
                                    `+data.userID+`
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="card-footer">
                              <div class="button-container">
                                <button type="button"  class="btn btn-icon btn-round btn-facebook">
                                <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://adsweekly.onrender.com/register/`+data.userID+`">
                                <i class="fab text-info fa-facebook"></i>
                                </a>
                                </button>
                                <button type="button"  class="btn btn-icon btn-round btn-twitter">
                                  <a target="_blank" href="https://twitter.com/intent/tweet?url=https://adsweekly.onrender.com/register/`+data.userID+`" class="">
                                    <i class="fab text-info fa-twitter"></i>
                                  </a>
                                </button>
                                <button type="button"  class="btn btn-icon btn-round btn-google">
                                <a target="_blank" href="https://api.whatsapp.com/send?text=https://adsweekly.onrender.com/register/`+data.userID+`" class="">
                                  <i class="fab text-success fa-whatsapp"></i>
                                </a>
                                </button>
                                  <div class="text-center">
                                    <h5 class="text-sm text-center text-secondary">Refer Now</h5>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                          <div class="col-md-8">
                            <div class="card">
                              <div class="card-header">
                                <h5 class="title">Personal Information</h5>
                              </div>
                              <div class="card-body">
                                  <div class="row">
                                    <div class="col-md-5 pr-md-1">
                                      <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" class="form-control" disabled="" placeholder="Email" value="`+data.email+`">
                                      </div>
                                    </div>
                                    <div class="col-md-3 px-md-1">
                                      <div class="form-group">
                                        <label>Sponsored By</label>
                                        <input type="text" class="form-control" disabled="" placeholder="Sponsored By" value="`+data.sponsorID+`">
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                            <div id="bankDetails">
                            </div>
                          </div>
                      </div>
                      `;
                    }else{
                      document.getElementById('content').innerHTML = `
                      <div class="row">
                        <div class="col-md-4">
                          <div class="card card-user">
                            <div class="card-body">
                              <div class="card-text">
                                <div class="author">
                                  <div class="block block-one"></div>
                                  <div class="block block-two"></div>
                                  <div class="block block-three"></div>
                                  <div class="block block-four"></div>
                                  <a href="javascript:void(0)">
                                    <img class="avatar" src="../assets/img/user_icon.png" alt="...">
                                    <h5 class="title">`+data.username+`</h5>
                                  </a>
                                  <p class="description">
                                    `+data.userID+`
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="card-footer">
                              <div class="button-container">
                                <button type="button"  class="btn btn-icon btn-round btn-facebook">
                                <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://adsweekly.onrender.com/register/`+data.userID+`">
                                <i class="fab text-info fa-facebook"></i>
                                </a>
                                </button>
                                <button type="button"  class="btn btn-icon btn-round btn-twitter">
                                  <a target="_blank" href="https://twitter.com/intent/tweet?url=https://adsweekly.onrender.com/register/`+data.userID+`" class="">
                                    <i class="fab text-info fa-twitter"></i>
                                  </a>
                                </button>
                                <button type="button"  class="btn btn-icon btn-round btn-google">
                                <a target="_blank" href="https://api.whatsapp.com/send?text=https://adsweekly.onrender.com/register/`+data.userID+`" class="">
                                  <i class="fab text-success fa-whatsapp"></i>
                                </a>
                                </button>
                                  <div class="text-center">
                                    <h5 class="text-sm text-center text-secondary">Refer Now</h5>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                          <div class="col-md-8">
                            <div class="card">
                              <div class="card-header">
                                <h5 class="title">Personal Information</h5>
                              </div>
                              <div class="card-body">
                                  <div class="row">
                                    <div class="col-md-5 pr-md-1">
                                      <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" class="form-control" disabled="" placeholder="Email" value="`+data.email+`">
                                      </div>
                                    </div>
                                    <div class="col-md-3 px-md-1">
                                      <div class="form-group">
                                        <label>Sponsored By</label>
                                        <input type="text" class="form-control" disabled="" placeholder="Sponsored By" value="`+data.sponsorID+` - `+data.sponsorName+`">
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                            <div id="bankDetails">
                            </div>
                          </div>
                      </div>
                      `;
                    }

                  }

        const navbarToProfile = function(){
          document.getElementById('dashboard').innerHTML = `
          <div class="navbar-toggle d-inline">
            <button type="button" class="navbar-toggler">
              <span class="navbar-toggler-bar bar1"></span>
              <span class="navbar-toggler-bar bar2"></span>
              <span class="navbar-toggler-bar bar3"></span>
            </button>
          </div>
          <a class="navbar-brand" href="javascript:void(0)">Profile</a>
          `;

        }

        const sidebarToProfile = function(){
          document.getElementById('sidebar').innerHTML = `
          <div class="sidebar-wrapper">
            <div class="logo">
              <a href="javascript:void(0)" class="simple-text logo-mini">
                ADs
              </a>
              <a href="javascript:void(0)" class="simple-text logo-normal">
                Weekly
              </a>
            </div>
            <ul class="nav" id="nav-bar">
              <li>
                <a href="javascript:dashboard()" class="dashboard">
                  <i class="tim-icons icon-chart-pie-36"></i>
                  <p>Dashboard</p>
                </a>
              </li>
              <li class="active ">
                <a href="javascript:profile()" class="profile">
                  <i class="tim-icons icon-single-02"></i>
                  <p class="profile">profile</p>
                </a>
              </li>
              <li>
                <a href="javascript:package()">
                  <i class="tim-icons icon-atom"></i>
                  <p>Package</p>
                </a>
              </li>
              <li>
                <a href="javascript:withdrawal()">
                  <i class="tim-icons icon-money-coins"></i>
                  <p>Withdrawal</p>
                </a>
              </li>
              <li>
                <a href="javascript:transaction()">
                  <i class="tim-icons icon-align-left-2"></i>
                  <p>Transaction</p>
                </a>
              </li>
            </ul>
          </div>
          `;
        }

        const bankToProfile = function(){
          if(data.bank == true){
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
          }else{
            document.getElementById('bankDetails').innerHTML = `
              <div class="card">
                <div class="card-header">
                  <h5 class="title">Enter Bank details</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                      <div class="col-md-5 pr-md-1">
                        <div class="form-group">
                          <label>Account Holder Name</label>
                          <input type="text" class="form-control" id="holdersName" name="holdersName" placeholder="Name">
                        </div>
                      </div>
                      <div class="col-md-3 px-md-1">
                        <div class="form-group">
                          <label>Account Number</label>
                          <input type="text" class="form-control" id="accountNumber" name="accountNumber" placeholder="Account Number">
                        </div>
                      </div>
                      <div class="col-md-3 px-md-1">
                        <div class="form-group">
                          <label>Bank name</label>
                          <input type="text" class="form-control" id="bankName" name="bankName" placeholder="Bank name">
                        </div>
                      </div>
                      <div class="col-md-3 px-md-1">
                        <div class="form-group">
                          <label>IFSC code</label>
                          <input type="text" class="form-control" id="ifsc" name="ifsc" placeholder="ifsc">
                        </div>
                      </div>
                    </div>
                    <div class="card-footer">
                      <button onclick="bankDetails()" class="btn btn-fill btn-success">Submit</button>
                    </div>
                </div>
              </div>
            `
          }

        }

        $( document ).ready(function() {
            navbarToProfile();
        });
        $( document ).ready(function() {
            sidebarToProfile();
        });
        $( document ).ready(function() {
            contentToProfile();
        });
        $( document ).ready(function() {
            bankToProfile();
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

const dashboard = function(){
    var $toggle = $('.navbar-toggle');
    if (blackDashboard.misc.navbar_menu_visible == 1) {
      $html.removeClass('nav-open');
      blackDashboard.misc.navbar_menu_visible = 0;
      setTimeout(function() {
        $toggle.removeClass('toggled');
        $('.bodyClick').remove();
      }, 550);

    } else {
      setTimeout(function() {
        $toggle.addClass('toggled');
      }, 580);

      var div = '<div class="bodyClick"></div>';
      $(div).appendTo('body').click(function() {
        $html.removeClass('nav-open');
        blackDashboard.misc.navbar_menu_visible = 0;
        setTimeout(function() {
          $toggle.removeClass('toggled');
          $('.bodyClick').remove();
        }, 550);
      });

      $html.addClass('nav-open');
      blackDashboard.misc.navbar_menu_visible = 1;
  }

  $.ajax({
    url: '/api/dashboard',
    type: "GET",
    success: function(data){
        if( data.redirect == undefined){

          const contentToDashboard = function(){
            document.getElementById('content').innerHTML = `
            <div class="row">
              <div class="col-12">
                <div class="card bg-success">
                  <div class="card-header ">
                    <div class="row">
                      <div class="col-sm-6 text-left">
                        <h2 class="card-title text-white">Overview</h2>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="my-3">
                      <div class="text-center mb-2">
                        <h5 class="card-category text-white text-sm">Available Balance: <span class="font-weight-bold">`+data.availableBalance+`  </span></h5>
                      </div>
                      <hr class="horizontal">
                      <div class="row">
                        <div class="text-center col">
                          <h5 class="card-category text-white">Total Income</h5>
                          <h4 class="card-title text-white"> `+data.totalIncome+` <span class="card-category text-white">/-</span></h4>
                        </div>
                        <div class="text-center col">
                          <h5 class="text-end card-category text-white">Weekly Income</h5>
                          <h4 class="text-end card-title text-white"> `+data.royal+` <span class="card-category text-white">/-</span></h4>
                        </div>
                      </div>
                      <hr class="horizontal">
                      <div class="row">
                        <div class="text-center col">
                          <h5 class="card-category text-white">Direct Income</h5>
                          <h4 class="card-title text-white">`+data.direct+` <span class="card-category text-white">/-</span></h4>
                        </div>
                          <div class="text-center col">
                            <h5 class="card-category text-white">Level Income</h5>
                            <h4 class="card-title text-white">`+data.level+` <span class="card-category text-white">/-</span></h4>
                          </div>
                      </div>
                      <hr class="horizontal">
                      <div class="row">
                        <div class="text-center col">
                          <h5 class="card-category text-white">Team Earnings</h5>
                          <h4 class="card-title text-white">`+data.team+` <span class="card-category text-white">/-</span></h4>
                        </div>
                        <div class="text-center col">
                          <h5 class="text-end card-category text-white">Club Earnings</h5>
                          <h4 class="text-end card-title text-white">`+data.franchise+` <span class="card-category text-white">/-</span></h4>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="" id="currentPackage">

            </div>
            `;

          }

          const navbarToDashboard = function(){
            document.getElementById('dashboard').innerHTML = `
            <div class="navbar-toggle d-inline">
              <button type="button" class="navbar-toggler">
                <span class="navbar-toggler-bar bar1"></span>
                <span class="navbar-toggler-bar bar2"></span>
                <span class="navbar-toggler-bar bar3"></span>
              </button>
            </div>
            <a class="navbar-brand" href="javascript:void(0)">Dashboard</a>
            `;

          }

          const sidebarToDashboard = function(){
            document.getElementById('sidebar').innerHTML = `
            <div class="sidebar-wrapper">
              <div class="logo">
                <a href="javascript:void(0)" class="simple-text logo-mini">
                  ADs
                </a>
                <a href="javascript:void(0)" class="simple-text logo-normal">
                  Weekly
                </a>
              </div>
              <ul class="nav" id="nav-bar">
                <li class="active ">
                  <a href="javascript:dashboard()" class="dashboard">
                    <i class="tim-icons icon-chart-pie-36"></i>
                    <p>Dashboard</p>
                  </a>
                </li>
                <li>
                  <a href="javascript:profile()" class="profile">
                    <i class="tim-icons icon-single-02"></i>
                    <p class="profile">profile</p>
                  </a>
                </li>
                <li>
                  <a href="javascript:package()">
                    <i class="tim-icons icon-atom"></i>
                    <p>Package</p>
                  </a>
                </li>
                <li>
                  <a href="javascript:withdrawal()">
                    <i class="tim-icons icon-money-coins"></i>
                    <p>Withdrawal</p>
                  </a>
                </li>
                <li>
                  <a href="javascript:transaction()">
                    <i class="tim-icons icon-align-left-2"></i>
                    <p>Transaction</p>
                  </a>
                </li>
              </ul>
            </div>
            `;
          }

          const currentPackage = function(){

            if(data.task.status == "Active"){
               //For Active Task users
               document.getElementById('currentPackage').innerHTML = `
                     <!-- Modal -->
                     <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                       <div class="modal-dialog">
                         <div class="modal-content">
                           <div class="modal-header">
                             <h4 class=" fs-5" id="exampleModalLabel">Today's Task</h4>
                           </div>
                           <div class="modal-body text-center" id="modalBody">
                             <div class="text-center" id="player">
                               <iframe width="auto" class="text-center" height="auto" src="https://www.youtube.com/embed/`+data.taskLink+`" frameborder="0" allowfullscreen></iframe>
                             </div>
                           </div>
                           <div class="modal-footer">
                             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                             <button type="button" onclick="dailyTask()" id="dailyTask" disabled class="btn btn-success" data-bs-dismiss="modal">Done</button>
                           </div>
                         </div>
                       </div>
                     </div>

                     <div class="">
                       <div class="card bg-success">
                         <div class="card-header ">
                           <div class="row">
                             <div class="col-sm-6 text-left">
                               <h4 class="card-title tex-white text-center">Current Plan Details</h4>
                             </div>
                           </div>
                         </div>
                         <div class="card-body">

                             <div class="row">
                               <div class="text-center col">
                                 <h5 class="card-category tex-white">Plan Status</h5>
                                 <h5 class="card-title text-sm tex-white">`+data.task.status+`<i class="tim-icons icon-sound-wave text-info"></i></h5>
                               </div>
                               <div class="text-center col">
                                   <h5 class="text-end card-category tex-white">Today's Task</h5>
                                   <h5 class="text-end card-title text-sm btn btn-sm btn-simple active btn-success"  data-bs-toggle="modal" data-bs-target="#exampleModal">Start</h5>
                                </div>
                             </div>
                             <hr class="horizontal">
                             <div class="row">
                               <div class="text-center col">
                                 <h5 class="card-category tex-white">Package</h5>
                                 <h5 class="card-title text-sm  tex-white"> `+data.task.tier+` -  `+data.currentPackage+`  <span class="card-category">/-</span></h5>
                               </div>
                               <div class="text-center col">
                                 <h5 class="text-end card-category tex-white">Day</h5>
                                 <h5 class="text-end card-title tex-white text-sm">`+data.task.days+`</h5>
                               </div>
                             </div>

                           </div>
                         </div>
                       </div>`

            }else{
              if(data.task.status == "Cooldown" || data.task.status == "Activation Required" ){
                //For Active Non-Task Users
                document.getElementById('currentPackage').innerHTML = `
                      <div class="">
                        <div class="card bg-success">
                          <div class="card-header ">
                            <div class="row">
                              <div class="col-sm-6 text-left">
                                <h4 class="card-title text-white text-center">Current Plan Details</h4>
                              </div>
                            </div>
                          </div>
                          <div class="card-body">

                              <div class="row">
                                <div class="text-center col">
                                  <h5 class="card-category text-white">Plan Status</h5>
                                  <h5 class="card-title text-white text-sm">`+data.task.status+`<i class="tim-icons icon-sound-wave text-info"></i></h5>
                                </div>
                                <div class="text-center col">
                                    <h5 class="text-end card-category">Renews tommorow at</h5>
                                    <h5 class="text-end text-white card-title text-sm">1:00am</h5>
                                </div>
                              </div>
                              <hr class="horizontal">
                              <div class="row">
                                <div class="text-center col">
                                  <h5 class="card-category text-white">Package</h5>
                                  <h5 class="card-title text-sm text-white"> `+data.task.tier+` -  `+data.currentPackage+`  <span class="card-category">/-</span></h5>
                                </div>
                                <div class="text-center col">
                                  <h5 class="text-end card-category text-white">Day</h5>
                                  <h5 class="text-end card-title text-sm text-white">`+data.task.day+`s</h5>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>`
              }else{
                //For Normal User
                document.getElementById('currentPackage').innerHTML = `
                      <div class="">
                        <div class="card bg-success">
                          <div class="card-header ">
                            <div class="row">
                              <div class="col-sm-6 text-left">
                                <h4 class="card-title text-white text-center">Current Plan Details</h4>
                              </div>
                            </div>
                          </div>
                          <div class="card-body">
                              <div class="row">
                                <div class="text-center col">
                                  <h5 class="card-category text-white">Plan Status</h5>
                                  <h5 class="card-title text-white text-sm">No Active Plan<i class="tim-icons icon-sound-wave text-info"></i></h5>
                                </div>
                                <div class="text-center col">
                                  <h5 class="text-end text-white card-category">Enroll time</h5>
                                  <h5 class="text-end text-white card-title text-sm">Nil</h5>
                                </div>
                              </div>
                              <hr class="horizontal">
                              <div class="row">
                                <div class="text-center col">
                                  <h5 class="card-category text-white">Package</h5>
                                  <h5 class="card-title text-sm text-white"> 0 <span class="card-category text-success">/-</span></h5>
                                </div>
                                <div class="text-center col">
                                  <h5 class="text-end text-white card-category">Day</h5>
                                  <h5 class="text-end text-white card-title text-sm">0</h5>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>`
              }
            }

          }

          $( document ).ready(function() {
              navbarToDashboard();
          });
          $( document ).ready(function() {
              sidebarToDashboard();
          });
          $( document ).ready(function() {
              contentToDashboard();
          });
          $( document ).ready(function() {
              currentPackage();
          });

        }else{
          login2000();
        }
      },
    error: function(status, error){
      console.log(error);
    }
  });



}

const package =function(){

      var $toggle = $('.navbar-toggle');
      if (blackDashboard.misc.navbar_menu_visible == 1) {
        $html.removeClass('nav-open');
        blackDashboard.misc.navbar_menu_visible = 0;
        setTimeout(function() {
          $toggle.removeClass('toggled');
          $('.bodyClick').remove();
        }, 550);

      } else {
        setTimeout(function() {
          $toggle.addClass('toggled');
        }, 580);

        var div = '<div class="bodyClick"></div>';
        $(div).appendTo('body').click(function() {
          $html.removeClass('nav-open');
          blackDashboard.misc.navbar_menu_visible = 0;
          setTimeout(function() {
            $toggle.removeClass('toggled');
            $('.bodyClick').remove();
          }, 550);
        });

        $html.addClass('nav-open');
        blackDashboard.misc.navbar_menu_visible = 1;
      }


        $.ajax({
          url: '/package',
          type: 'GET',
          success: function (data) {
            if( data.redirect == undefined){

              const contentToPackage = function(){
                document.getElementById('content').innerHTML = `
                <div class="row">
                <div class="col-md-12">
                <div class="card ">
                <div class="card-header">
                <h4 class="card-title"> Package Details</h4>
                </div>
                <div class="card-body">
                <div class="table-responsive" style="overflow: hidden;">
                <div class="text-center">
                <p>Plan details</p>
                </div>
                <hr>
                <table class="table tablesorter " id="">
                <thead class=" text-success">
                <tr>
                <th class="text-center">
                Tier
                </th>
                <th class="text-center">
                Returns
                </th>
                <th class="text-center">
                Plan
                </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td class="text-center">
                Basic
                </td>
                <td class="text-center">
                1.4X
                </td>
                <td class="text-center ">
                <p onclick='paymentGateway(this)' id="B2"  class="btn btn-sm btn-success btn-simple active package-btn">500</p>
                </td>
                </tr>
                <tr>
                <td class="text-center">
                Bronze
                </td>
                <td class="text-center">
                1.4X
                </td>
                <td class="text-center ">
                <p onclick='paymentGateway(this)' id="B3"  class="btn btn-sm btn-success btn-simple active package-btn">1000</p>
                </td>
                </tr>
                <tr>
                <td class="text-center">
                Silver
                </td>
                <td class="text-center">
                1.5X
                </td>
                <td class="text-center ">
                <p  onclick='paymentGateway(this)' id="S2"  class="btn btn-sm btn-success btn-simple active package-btn">6000</p>
                </td>
                </tr>
                <tr>
                <td class="text-center">
                Gold
                </td>
                <td class="text-center">
                1.5X
                </td>
                <td class="text-center ">
                <p  onclick='paymentGateway(this)' id="S3"  class="btn btn-sm btn-success btn-simple active package-btn">10000</p>
                </td>
                </tr>
                <tr>
                <td class="text-center">
                Platinum
                </td>
                <td class="text-center">
                1.6X
                </td>
                <td class="text-center ">
                <p onclick='paymentGateway(this)' id="G1"  class="btn btn-sm btn-success btn-simple active package-btn">25000</p>
                </td>
                </tr>
                <tr>
                <td class="text-center">
                Diamond
                </td>
                <td class="text-center">
                1.6X
                </td>
                <td class="text-center ">
                <p onclick='paymentGateway(this)' id="G2"  class="btn btn-sm btn-success btn-simple active package-btn">50000</p>
                </td>
                </tr>
                </tbody>
                </table>
                </div>
                </div>
                </div>
                </div>

                `;
              }

              const navbarToPackage = function(){
                document.getElementById('dashboard').innerHTML = `
                <div class="navbar-toggle d-inline">
                <button type="button" class="navbar-toggler">
                <span class="navbar-toggler-bar bar1"></span>
                <span class="navbar-toggler-bar bar2"></span>
                <span class="navbar-toggler-bar bar3"></span>
                </button>
                </div>
                <a class="navbar-brand" href="javascript:void(0)">Package</a>
                `;

              }

              const sidebarToPackage = function(){
                document.getElementById('sidebar').innerHTML = `
                <div class="sidebar-wrapper">
                <div class="logo">
                <a href="javascript:void(0)" class="simple-text logo-mini">
                ADs
                </a>
                <a href="javascript:void(0)" class="simple-text logo-normal">
                Weekly
                </a>
                </div>
                <ul class="nav" id="nav-bar">
                <li>
                <a href="javascript:dashboard()" class="dashboard">
                <i class="tim-icons icon-chart-pie-36"></i>
                <p>Dashboard</p>
                </a>
                </li>
                <li>
                <a href="javascript:profile()" class="profile">
                <i class="tim-icons icon-single-02"></i>
                <p class="profile">profile</p>
                </a>
                </li>
                <li class="active ">
                <a href="javascript:package()" class="package">
                <i class="tim-icons icon-atom"></i>
                <p>Package</p>
                </a>
                </li>
                <li>
                <a href="javascript:withdrawal()">
                <i class="tim-icons icon-money-coins"></i>
                <p>Withdrawal</p>
                </a>
                </li>
                <li>
                <a href="javascript:transaction()">
                <i class="tim-icons icon-align-left-2"></i>
                <p>Transaction</p>
                </a>
                </li>
                </ul>
                </div>
                `;
              }


              $( document ).ready(function() {
                navbarToPackage();
              });
              $( document ).ready(function() {
                sidebarToPackage();
              });
              $( document ).ready(function() {
                contentToPackage();
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

const paymentGateway = function(clickedButton){
    const amount = clickedButton.innerHTML
    const tier = clickedButton.id
  $.ajax({
    url: "/api/paymentGateway",
    data:{
      amount: amount,
      tier: tier
    },
    type: "POST",
    success:function(data){
      if( data.redirect == undefined){
        if(data.plan == "Not enrolled"){

            const contentToDashboard = function(){
              document.getElementById('content').innerHTML = `
              <div class="row">
                <div class="col-12">
                  <div class="card card-chart">
                    <div class="card-header ">
                      <div class="row">
                        <div class="col-sm-6 text-left">
                          <h2 class="card-title">Payment Gateway</h2>
                        </div>
                        <br>
                      </div>
                    </div>
                    <hr>
                    <div class="card-body">

                         <h5 class="m-2">Step 1:- Scan the QR and complete the trasaction</h5>
                        <div class=" text-center">
                          <img class="text-center scanner_img" id="qrcode" alt="">
                        </div>
                         <hr>
                         <h5 class="m-2">Step 2:- Enter the UTR transaction number & the amount and Verify</h5>
                         <div class="mt-3 row text-center">
                           <div class="col">

                           </div>
                           <div class="form-group text-center col-8">
                             <input type="text" autocomplete="off" id="trnxId" name="trnxId" class="form-control text-center" required placeholder="Enter the UTR number">
                           </div>
                           <div class="col">

                           </div>
                         </div>
                         <div class="mt-3 row text-center">
                           <div class="col">

                           </div>
                           <div class="form-group text-center col-6">
                             <input type="text" autocomplete="off" id="amount" disabled name="amount" class="form-control text-center" value="`+data.amount+`" required>
                               <input type="text" autocomplete="off" id="tier" hidden name="amount" class="form-control text-center" value="`+data.tier+`" required>
                           </div>
                           <div class="col">

                           </div>
                         </div>
                         <div class="text-center mt-3">
                           <p onclick='paymentVerification()' class="btn btn-sm btn-success btn-simple active text-center package-btn">Verify</p>
                         </div>

                    </div>
                  </div>
                </div>
              </div>
              `;
            }

            $( document ).ready(function() {
                contentToDashboard();
            });
        }else{
            demo.showNotification('bottom','center', 'warning', "Cannot Enroll for more than one plan!!");

        }
      }else{
        login2000();
      }
      fetchQRCode()
    },
    error: function(status, error){
      console.log('Error: ' + error.message);
    }
  });



}

const withdrawal = function(){

  var $toggle = $('.navbar-toggle');
  if (blackDashboard.misc.navbar_menu_visible == 1) {
    $html.removeClass('nav-open');
    blackDashboard.misc.navbar_menu_visible = 0;
    setTimeout(function() {
      $toggle.removeClass('toggled');
      $('.bodyClick').remove();
    }, 550);

  } else {
    setTimeout(function() {
      $toggle.addClass('toggled');
    }, 580);

    var div = '<div class="bodyClick"></div>';
    $(div).appendTo('body').click(function() {
      $html.removeClass('nav-open');
      blackDashboard.misc.navbar_menu_visible = 0;
      setTimeout(function() {
        $toggle.removeClass('toggled');
        $('.bodyClick').remove();
      }, 550);
    });

    $html.addClass('nav-open');
    blackDashboard.misc.navbar_menu_visible = 1;
  }

  $.ajax({
    url: '/withdraw',
    type: 'GET',
    success: function (data) {
      if( data.redirect == undefined){

        const contentToWithdrawal = function(){
          document.getElementById('content').innerHTML = `
          <div class="row">
            <div class="col-12">
              <div class="card card-chart" style="height: 500px;">
                <div class="card-body">
                  <div class="my-3 mb-3">
                    <div class="text-center mt-4 mb-5">
                      <h5 class="">Enter amount you want to withdraw</h5>
                    </div>
                    <div class="mt-3 row text-center">
                      <div class="col">

                      </div>
                      <div class="form-group text-center col-8">
                        <input type="number" oninput="amountValidaion()" autocomplete="off" id="amount" name="amount" class="form-control text-center" required >
                      </div>
                      <div class="col">

                      </div>
                    </div>
                    <div class="text-center my-2">
                      <h5 class="card-category text-sm">Available Balance: <span id="availableBalance" class="font-weight-bold">`+data.availableBalance+`</span></h5>
                    </div>
                    <div class="" style="height: 70px">

                    </div>
                    <div class="text-center mt-3">
                      <button onclick='withdraw()' name="withdrawalSubmit" id="withdrawalSubmit" disabled class="btn btn-success btn-simple text-center package-btn">Withdrawal</button>
                    </div>

                  </div>
                  <div class="" >
                    <h5 id="validater" class="text-center text-danger"></h5>
                    <p id="bankDetails" hidden>`+data.bankDetails+`</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
        }

        const navbarToWithdrawal = function(){
          document.getElementById('dashboard').innerHTML = `
          <div class="navbar-toggle d-inline">
            <button type="button" class="navbar-toggler">
              <span class="navbar-toggler-bar bar1"></span>
              <span class="navbar-toggler-bar bar2"></span>
              <span class="navbar-toggler-bar bar3"></span>
            </button>
          </div>
          <a class="navbar-brand" href="javascript:void(0)">Withdraw</a>
          `;

        }

        const sidebarToWithdrawal = function(){
          document.getElementById('sidebar').innerHTML = `
          <div class="sidebar-wrapper">
            <div class="logo">
              <a href="javascript:void(0)" class="simple-text logo-mini">
                ADs
              </a>
              <a href="javascript:void(0)" class="simple-text logo-normal">
                Weekly
              </a>
            </div>
            <ul class="nav" id="nav-bar">
              <li>
                <a href="javascript:dashboard()" class="dashboard">
                  <i class="tim-icons icon-chart-pie-36"></i>
                  <p>Dashboard</p>
                </a>
              </li>
              <li>
                <a href="javascript:profile()" class="profile">
                  <i class="tim-icons icon-single-02"></i>
                  <p class="profile">profile</p>
                </a>
              </li>
              <li>
                <a href="javascript:package()" class="package">
                  <i class="tim-icons icon-atom"></i>
                  <p>Package</p>
                </a>
              </li>
              <li class="active">
                <a href="javascript:withdrawal()">
                  <i class="tim-icons icon-money-coins"></i>
                  <p>Withdrawal</p>
                </a>
              </li>
              <li>
                <a href="javascript:transaction()">
                  <i class="tim-icons icon-align-left-2"></i>
                  <p>Transaction</p>
                </a>
              </li>
            </ul>
          </div>
          `;
        }


        $( document ).ready(function() {
            navbarToWithdrawal();
        });
        $( document ).ready(function() {
            sidebarToWithdrawal();
        });
        $( document ).ready(function() {
            contentToWithdrawal();
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

const transaction = function(){

    var $toggle = $('.navbar-toggle');
    if (blackDashboard.misc.navbar_menu_visible == 1) {
      $html.removeClass('nav-open');
      blackDashboard.misc.navbar_menu_visible = 0;
      setTimeout(function() {
        $toggle.removeClass('toggled');
        $('.bodyClick').remove();
      }, 550);

    } else {
      setTimeout(function() {
        $toggle.addClass('toggled');
      }, 580);

      var div = '<div class="bodyClick"></div>';
      $(div).appendTo('body').click(function() {
        $html.removeClass('nav-open');
        blackDashboard.misc.navbar_menu_visible = 0;
        setTimeout(function() {
          $toggle.removeClass('toggled');
          $('.bodyClick').remove();
        }, 550);
      });

      $html.addClass('nav-open');
      blackDashboard.misc.navbar_menu_visible = 1;
    }

    $.ajax({
      url: '/transaction',
      type: 'GET',
      success: function(data){
        if( data.redirect == undefined){
          if(data.transaction.length == 0){
            //Handling for No transaction event
              demo.showNotification('bottom','center', 'warning', "No transactions found");
          }else{
          const transactions = data.transaction;

          const contentHeaderToTransaction = function(){
            document.getElementById('content').innerHTML = `
            <div class="row">
              <div class="col-md-12">
                <div class="card ">
                  <div class="card-header">
                    <h3 class="card-title"> Transaction</h3>
                  </div>
                  <div class="card-body">

                    <!-- Modal -->
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content white-content">
                          <div class="modal-header">
                            <h3 class=" fs-5" id="exampleModalLabel">Transaction Details</h3>
                          </div>
                          <div class="modal-body" id="modalBody">
                            <div class="spinner-grow" role="status">
                              <span class="visually-hidden">Loading...</span>
                            </div>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="table-responsive" style="overflow: hidden;">
                      <table class="table tablesorter " id="">
                        <thead class=" text-success">
                          <tr>
                            <th class="">
                              Transaction
                            </th>
                            <th class="text-center">
                              TRNX ID
                            </th>
                            <th class="text-center">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody id="trnxBody" class="white-content">

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            `;
          }

          const navbarToTransaction = function(){
            document.getElementById('dashboard').innerHTML = `
            <div class="navbar-toggle d-inline">
              <button type="button" class="navbar-toggler">
                <span class="navbar-toggler-bar bar1"></span>
                <span class="navbar-toggler-bar bar2"></span>
                <span class="navbar-toggler-bar bar3"></span>
              </button>
            </div>
            <a class="navbar-brand" href="javascript:void(0)">Transaction</a>
            `;

          }

          const sidebarToTransaction = function(){
            document.getElementById('sidebar').innerHTML = `
            <div class="sidebar-wrapper">
              <div class="logo">
                <a href="javascript:void(0)" class="simple-text logo-mini">
                  ADs
                </a>
                <a href="javascript:void(0)" class="simple-text logo-normal">
                  Weekly
                </a>
              </div>
              <ul class="nav" id="nav-bar">
                <li>
                  <a href="javascript:dashboard()" class="dashboard">
                    <i class="tim-icons icon-chart-pie-36"></i>
                    <p>Dashboard</p>
                  </a>
                </li>
                <li>
                  <a href="javascript:profile()" class="profile">
                    <i class="tim-icons icon-single-02"></i>
                    <p class="profile">profile</p>
                  </a>
                </li>
                <li>
                  <a href="javascript:package()" class="package">
                    <i class="tim-icons icon-atom"></i>
                    <p>Package</p>
                  </a>
                </li>
                <li>
                  <a href="javascript:withdrawal()">
                    <i class="tim-icons icon-money-coins"></i>
                    <p>Withdrawal</p>
                  </a>
                </li>
                <li class="active">
                  <a href="javascript:transaction()">
                    <i class="tim-icons icon-align-left-2"></i>
                    <p>Transaction</p>
                  </a>
                </li>
              </ul>
            </div>
            `;
          }

          const transactionsTobody = function(){
            transactions.forEach(function(transaction){
                if(transaction.type == "Credit"){
                  // Handle for amount credited event
                  if(transaction.status == "Pending"){
                    document.getElementById('trnxBody').innerHTML += `
                    <tr>
                      <td class="">
                        `+transaction.from+` <i id="`+transaction.trnxId+`" onclick="modalBody(this)" data-bs-toggle="modal" data-bs-target="#exampleModal" class="tim-icons icon-alert-circle-exc text-info"></i>
                      </td>
                      <td class="text-center">
                        Pending
                      </td>
                      <td class="text-center">
                        <p class=""><span>`+transaction.amount+`</span>/-</p>
                      </td>
                    </tr>

                    `;
                  }
                  if(transaction.status == "Failed"){
                    document.getElementById('trnxBody').innerHTML += `
                    <tr>
                      <td class="">
                        `+transaction.from+`
                      </td>
                      <td class="text-center text-danger">
                        Failed
                      </td>
                      <td class="text-center">
                        <p class="text-success">+ <span>`+transaction.amount+`</span>/-</p>
                      </td>
                    </tr>

                    `;
                  }
                  if(transaction.status == "Success"){
                    if(transaction.from == "Invested" ||transaction.from == "Withdraw" ||transaction.from == "Daily Task" ||transaction.from == "Club Earnings"){
                      document.getElementById('trnxBody').innerHTML += `
                      <tr>
                        <td class="">
                          `+transaction.from+` <i id="`+transaction.trnxId+`" onclick="modalBody(this)" data-bs-toggle="modal" data-bs-target="#exampleModal" class="tim-icons icon-alert-circle-exc text-info"></i>
                          <input type="text" autocomplete="off" id="tier" hidden name="amount" class="form-control text-center" value="`+data.tier+`" required>
                      </td>
                        <td class="text-center">
                          `+transaction.trnxId+`
                        </td>
                        <td class="text-center">
                          <p class="text-success">+ <span>`+transaction.amount+`</span>/-</p>
                        </td>
                      </tr>

                      `;
                    }else{
                      document.getElementById('trnxBody').innerHTML += `
                      <tr>
                        <td class="">
                          `+transaction.incomeType+` <i id="`+transaction.trnxId+`" onclick="modalBody(this)" data-bs-toggle="modal" data-bs-target="#exampleModal" class="tim-icons icon-alert-circle-exc text-info"></i>
                        </td>
                        <td class="text-center">
                          `+transaction.trnxId+`
                        </td>
                        <td class="text-center">
                          <p class="text-success">+ <span>`+transaction.amount+`</span>/-</p>
                        </td>
                      </tr>

                      `;
                    }
                  }
                }else{
                  //Handle for withdraw event
                  if(transaction.status == "Pending"){
                    document.getElementById('trnxBody').innerHTML += `
                    <tr>
                      <td class="">
                        `+transaction.from+` <i id="`+transaction.trnxId+`" onclick="modalBody(this)" data-bs-toggle="modal" data-bs-target="#exampleModal" class="tim-icons icon-alert-circle-exc text-info"></i>
                      </td>
                      <td class="text-center">
                        Pending
                      </td>
                      <td class="text-center">
                        <p class="text-danger">- <span>`+transaction.amount+`</span>/-</p>
                      </td>
                    </tr>

                    `;
                  }else{
                    if(transaction.status == "Failed"){
                      document.getElementById('trnxBody').innerHTML += `
                      <tr>
                        <td class="">
                          `+transaction.from+` <i id="`+transaction.trnxId+`" onclick="modalBody(this)" data-bs-toggle="modal" data-bs-target="#exampleModal" class="tim-icons icon-alert-circle-exc text-info"></i>
                        </td>
                        <td class="text-center">
                          Failed
                        </td>
                        <td class="text-center">
                          <p class="text-danger">- <span>`+transaction.amount+`</span>/-</p>
                        </td>
                      </tr>

                      `;
                    }else{
                      document.getElementById('trnxBody').innerHTML += `
                      <tr>
                        <td class="">
                          `+transaction.from+` <i id="`+transaction.trnxId+`" onclick="modalBody(this)" data-bs-toggle="modal" data-bs-target="#exampleModal" class="tim-icons icon-alert-circle-exc text-info"></i>
                        </td>
                        <td class="text-center">
                          `+transaction.trnxId+`
                        </td>
                        <td class="text-center">
                          <p class="text-danger">- <span>`+transaction.amount+`</span>/-</p>
                        </td>
                      </tr>

                      `;
                    }
                  }
                }
              });
          }

          $( document ).ready(function() {
              navbarToTransaction();
          });
          $( document ).ready(function() {
              sidebarToTransaction();
          });
          $( document ).ready(function() {
              contentHeaderToTransaction();
          });
          $( document ).ready(function() {
              transactionsTobody();
          });

          }
        }else{
          login2000();
        }
      },
      error: function(status, error){
        console.log(error.message);
      }
    });

}

const dailyTask = function(){
  $.ajax({
    url: '/dailyTaskCompletion',
    type: 'GET',
    success: function(data){
      if(data.task == "Completed"){
        dashboard2000();
      }
    },
    error: function(status, error){
      console.log(error.message);
    }
  });
}

