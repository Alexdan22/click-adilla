//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const uuid = require("uuid");
const path = require('path');
const shortid = require('shortid');
const cors = require('cors');
const schedule = require('node-schedule');
const sdk = require('api')('@decentro/v1.0#pwx2s1ddlp6q9m73');
const { DateTime } = require('luxon');
const app = express();
const QRCode = require('qrcode')

app.set('view engine', 'ejs');

app.use(cors())

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

app.use(cookieParser());

app.use(session({
    secret: process.env.RANDOM,
    saveUninitialized:false,
    resave: false
}));

mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://localhost:27017/clickAdDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://alex-dan:Admin-12345@cluster0.wirm8.mongodb.net/clickAdDB", {useNewUrlParser: true});


const timeZone = 'Asia/Kolkata';
const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


let d = new Date();
let year = currentTimeInTimeZone.year;
let month = currentTimeInTimeZone.month;
let date = currentTimeInTimeZone.day;
let hour = currentTimeInTimeZone.hour;
let minutes = currentTimeInTimeZone.minute;
let seconds = d.getSeconds();




const earningSchema = new mongoose.Schema({
  currentPackage: Number,
  totalPackage: Number,
  totalIncome: Number,
  directIncome: Number,
  levelIncome: Number,
  teamAch: Number,
  franchiseAch: Number,
  royalIncome: Number,
  availableBalance: Number
});
const bankDetailsSchema = new mongoose.Schema({
  name: String,
  accountNumber: String,
  bankName: String,
  ifsc: String
});
const transactionSchema = new mongoose.Schema({
  type: String,
  from: String,
  amount: Number,
  status: String,
  incomeType: String,
  userID: String,
  time:{
    date: String,
    month: String,
    year: String
  },
  trnxId: String
});
const taskSchema = new mongoose.Schema({
  status: String,
  tier: String,
  days: Number,
  time:{
    minutes: String,
    hours: String,
    day: String,
    month: String,
    year: String
  }
});
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  userID: {
    type: String,
    required: true
  },

  sponsorID: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  earnings: earningSchema,

  bankDetails: bankDetailsSchema,

  transaction: [transactionSchema],

  task: taskSchema,

  time: {
    date: String,
    month: String,
    year: String
  }

});
const adminSchema = new mongoose.Schema({
  email: String,
  payment:[
    {
      trnxId: String,
      email: String,
      amount: Number,
      username: String,
      time:{
        date: String,
        month: String,
        year: String,
        minutes: String,
        hour: String
      },
      status: String
    }
  ],
  withdrawal:[
    {
      trnxId: String,
      email: String,
      amount: Number,
      username: String,
      time:{
        date: String,
        month: String,
        year: String,
        minutes: String,
        hour: String
      },
    }
  ],
  taskLink: String
});
const paymentSchema = new mongoose.Schema({
  trnxId: String,
  email: String,
  amount: Number,
  username: String,
  time:{
    date: String,
    month: String,
    year: String,
    minutes: String,
    hour: String
  },
  status: String
})
const qrDataSchema = new mongoose.Schema({ text: String });


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

const Admin = new mongoose.model("Admin", adminSchema);

const Payment = new mongoose.model("Payment", paymentSchema);

const Data = new mongoose.model('Data', qrDataSchema);

//ROUTES
app.get("/", function(req, res){
  const alert = "false";
  res.render("login", {alert});
});

app.get("/register", function(req, res){
  if(req.session.sponsorID){
    const alert = "false";
    const sponsor = 'true';
    const sponsorID = req.session.sponsorID;
    res.render("register", {
      sponID:req.session.sponsorID,
      alert,
      sponsor,
      sponsorID
    });
  }else {
    const alert = "false";
    const sponsor = "false"
    res.render("register", {
      alert,
      sponsor
    });
  }
});

app.get("/dashboard", function(req, res){
  if(!req.session.user){
    res.redirect("/")
  }else{
    User.findOne({email: req.session.user.email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Admin.findOne({email:process.env.ADMIN}, function(err, foundAdmin){
          if(err){
            console.log(err);
          }else{
            User.find({sponsorID: foundUser.userID}, (err, downline)=>{
              if(downline.length != 0){
                const name = foundUser.username;
                const currentPackage = foundUser.earnings.currentPackage;
                const totalPackage = foundUser.earnings.totalPackage;
                const totalIncome = foundUser.earnings.totalIncome;
                const direct = foundUser.earnings.directIncome;
                const level = foundUser.earnings.levelIncome;
                const royal = foundUser.earnings.royalIncome;
                const team = foundUser.earnings.teamAch;
                const franchise = foundUser.earnings.franchiseAch;
                const availableBalance = foundUser.earnings.availableBalance;
                const task = foundUser.task;
                const alert = 'nil';
                const taskLink = foundAdmin.taskLink;
                const downlines = "exist";

                res.render("dashboard", {
                  name,
                  currentPackage,
                  totalPackage,
                  totalIncome,
                  direct,
                  level,
                  royal,
                  task,
                  team,
                  franchise,
                  availableBalance,
                  alert,
                  taskLink,
                  downlines
                });
              }else{
                const name = foundUser.username;
                const currentPackage = foundUser.earnings.currentPackage;
                const totalPackage = foundUser.earnings.totalPackage;
                const totalIncome = foundUser.earnings.totalIncome;
                const direct = foundUser.earnings.directIncome;
                const level = foundUser.earnings.levelIncome;
                const royal = foundUser.earnings.royalIncome;
                const team = foundUser.earnings.teamAch;
                const franchise = foundUser.earnings.franchiseAch;
                const availableBalance = foundUser.earnings.availableBalance;
                const task = foundUser.task;
                const alert = 'nil';
                const taskLink = foundAdmin.taskLink;
                const downlines = "Not available";

                res.render("dashboard", {
                  name,
                  currentPackage,
                  totalPackage,
                  totalIncome,
                  direct,
                  level,
                  royal,
                  task,
                  team,
                  franchise,
                  availableBalance,
                  alert,
                  taskLink,
                  downlines
                });
              }
            });
          }
        });
      }
    });
  }

});

app.get("/api/dashboard", function(req, res){
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    User.findOne({email: req.session.user.email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Admin.findOne({email:process.env.ADMIN}, function(err, foundAdmin){
          if(err){
            console.log(err);
          }else{

            const name = foundUser.username;
            const currentPackage = foundUser.earnings.currentPackage;
            const totalPackage = foundUser.earnings.totalPackage;
            const totalIncome = foundUser.earnings.totalIncome;
            const direct = foundUser.earnings.directIncome;
            const level = foundUser.earnings.levelIncome;
            const royal = foundUser.earnings.royalIncome;
            const team = foundUser.earnings.teamAch;
            const franchise = foundUser.earnings.franchiseAch;
            const availableBalance = foundUser.earnings.availableBalance;
            const task = foundUser.task;
            const alert = 'nil';
            const taskLink = foundAdmin.taskLink;

            res.status(200).send({
              name:name,
              currentPackage:currentPackage,
              totalPackage:totalPackage,
              totalIncome:totalIncome,
              direct:direct,
              level:level,
              royal:royal,
              task:task,
              team:team,
              franchise:franchise,
              availableBalance:availableBalance,
              alert:alert,
              taskLink:taskLink
            });
          }
        })
      }
    });
  }
})

app.get("/profile", function(req, res){
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    User.findOne({email: req.session.user.email}, function(err, foundUser){
     if(err){
       console.log(err);
     }else{
       User.findOne({userID: foundUser.sponsorID}, function(error, foundSponsor){
         if(!foundSponsor){
           //With no Registered Sponsor ID
           if(!foundUser.bankDetails){
             //No bank Details and
             const username = foundUser.username;
             const email = foundUser.email;
             const userID = foundUser.userID;
             const sponsorID = 'Not found';
             const bank = false;
             const bankDetails = 'Not provided';
             res.status(200).send({username, email, userID, sponsorID, bank, bankDetails});
           }else {
             const username = foundUser.username;
             const email = foundUser.email;
             const userID = foundUser.userID;
             const sponsorID = 'Not found';
             const bank = true;
             const bankDetails = foundUser.bankDetails;
             res.status(200).send({username, email, userID, sponsorID, bank, bankDetails});
           }
         }else{
           //With registered sponsor ID
           if(!foundUser.bankDetails){
             const username = foundUser.username;
             const email = foundUser.email;
             const userID = foundUser.userID;
             const sponsorID = foundSponsor.userID;
             const bank = false;
             const sponsorName = foundSponsor.username;
             const bankDetails = 'Not provided';
             res.status(200).send({username, email, userID,sponsorName, sponsorID, bank, bankDetails});
           }else {
             const username = foundUser.username;
             const email = foundUser.email;
             const userID = foundUser.userID;
             const sponsorID = foundSponsor.userID;
             const bank = true;
             const sponsorName = foundSponsor.username;
             const bankDetails = foundUser.bankDetails;
             res.status(200).send({username, email, userID,sponsorName, sponsorID, bank, bankDetails});
           }
         }
       });
     }
    });


  }
});

app.get("/package", function(req, res){
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    res.status(200).send({success:'true'});
  }
});

app.get("/withdraw", function(req, res){
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{

      User.findOne({email: req.session.user.email}, function(err, foundUser){
        if(err){
          console.log(err);
        }else{
          if(!foundUser.bankDetails){
            res.status(200).send({
              name: foundUser.username,
              email: foundUser.email,
              bankDetails: "Not provided",
              availableBalance: foundUser.earnings.availableBalance,
              alert: 'nil'

            });
          }else{
          res.status(200).send({
            name: foundUser.username,
            email: foundUser.email,
            bankDetails: "Provided",
            availableBalance: foundUser.earnings.availableBalance,
            alert: 'nil'

          });
          }
        }
        });
      }
});

app.get('/transaction', function(req, res){
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    User.findOne({email:req.session.user.email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        res.status(200).send({
          name: foundUser.username,
          email: foundUser.email,
          transaction: foundUser.transaction,
          alert: 'nil'
        });
      }
    });
  }
});

app.get("/adminLogin", function(req, res){
  res.render("adminLogin");
});

app.get("/admin", function(req, res){
  if(!req.session.admin){
    res.redirect("/adminLogin");
  }else{
    Admin.findOne({email:process.env.ADMIN}, function(err, foundAdmin){
      if(err){
        console.log(err);
      }else{
        User.find({}, function(err,foundUsers){
          if(err){
            console.log(err);
          }else{
            const total = foundUsers.length;
            const current = [];
            foundUsers.forEach(function(activeUsers){
              if(activeUsers.task.status == 'Active' || activeUsers.task.status == 'Cooldown'){
                current.push(activeUsers);
              }
            });
            let currentUsers = current.length;
            res.render("admin",
              {
                 total,
                 currentUsers,
                 pendingApproval:foundAdmin.payment.length,
                 pendingWithdraw:foundAdmin.withdrawal.length,
                 payment: foundAdmin.payment,
                 withdrawal: foundAdmin.withdrawal
               });
          }
        });
      }
    });
  }
});

app.get("/update", function(req, res){
  const admin = new Admin ({
    email: process.env.ADMIN,
    invest:[],
    withdrawal:[],
    taskLink: "https://m.youtube.com/watch?v=YVkUvmDQ3HY&pp=ygUMZW1pbmVtIHNvbmdz"
  });
  admin.save();
});

app.get("/currentInvestors", function(req, res){
  if(!req.session.admin){
    res.redirect('/adminLogin');
  }else{
    User.find({}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        let currentInvestor = [];
        foundUser.forEach(function(user){
          if(user.earnings.currentInvestment != 0){
            currentInvestor.push(user);
          }
        });
        res.render('investors', {
          currentInvestor
        });
      }
    })
  }
});

app.get("/register/:sponsorID", function(req, res){

  req.session.sponsorID = req.params.sponsorID;

  const alert = "false";
  const sponsor = 'true';
  const sponsorID = req.session.sponsorID;
  // res.render("register", {
  //   sponID:req.session.sponsorID,
  //   alert,
  //   sponsor,
  //   sponsorID
  // });
  res.redirect('/register');
});

app.get("/log-out", function(req, res){
  req.session.destroy();
  res.redirect("/");
});

app.get("/updatetask", function(req, res){
  const task = {
      status: 'Nil',
      tier: 'Nil',
      days: 0,
      time:{
        minutes: "Nil",
        hours: 'Nil',
        day: 'Nil',
        month: 'Nil',
        year: 'Nil'
    }
  }
  User.updateMany({},{$set:{task:task}}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log('update successful');
      res.redirect('/');
    }
  });
});

app.get("/api/transactionID/:trnxId", function(req, res){
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    User.findOne({email:req.session.user.email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        const trnxId = req.params.trnxId;
        foundUser.transaction.forEach(function(transaction){
          if(transaction.trnxId == trnxId){
            res.status(200).send({foundTransaction: transaction});
          }
        })
      }
    })
  }
});

app.get('/dailyTaskCompletion', function(req, res){
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
 if(!req.session.user){
   res.status(200).send({redirect:true});
 }else{
   User.findOne({email:req.session.user.email}, function(err, foundUser){
     if(err){
       console.log(err);
     }else{
       //Validate for Active User
       if(foundUser.task.status == "Active"){
       //Validate for Tier Information
         if(foundUser.task.tier == "B1"){
         //Validate for Day Count
           if(foundUser.task.days == 1){
             //Credit the amount in User balance

             const credit = 10;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:2,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 2){
             //Credit the amount in User balance

             const credit = 20;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 3){
             //Credit the amount in User balance

             const credit = 30;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 4){
             //Credit the amount in User balance

             const credit = 40;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 5){
             //Credit the amount in User balance

             const credit = 50;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 6){
             //Credit the amount in User balance

             const credit = 60;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 7){
             //Credit the amount in User balance

             const credit = 70;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Inactive",
                     tier:"Nil",
                     days:0,
                     time:{
                       minutes: "Nil",
                       hours: "Nil",
                       day: "Nil",
                       month: "Nil",
                       year: "Nil"
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
         }
         if(foundUser.task.tier == "B2"){
         //Validate for Day Count
           if(foundUser.task.days == 1){
             //Credit the amount in User balance

             const credit = 25;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:2,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 2){
             //Credit the amount in User balance

             const credit = 50;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 3){
             //Credit the amount in User balance

             const credit = 75;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 4){
             //Credit the amount in User balance

             const credit = 100;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 5){
             //Credit the amount in User balance

             const credit = 125;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 6){
             //Credit the amount in User balance

             const credit = 150;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 7){
             //Credit the amount in User balance

             const credit = 175;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Inactive",
                     tier:"Nil",
                     days:0,
                     time:{
                       minutes: "Nil",
                       hours: "Nil",
                       day: "Nil",
                       month: "Nil",
                       year: "Nil"
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
         }
         if(foundUser.task.tier == "B3"){
         //Validate for Day Count
           if(foundUser.task.days == 1){
             //Credit the amount in User balance

             const credit = 50;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:2,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 2){
             //Credit the amount in User balance

             const credit = 100;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 3){
             //Credit the amount in User balance

             const credit = 150;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 4){
             //Credit the amount in User balance

             const credit = 200;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 5){
             //Credit the amount in User balance

             const credit = 250;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 6){
             //Credit the amount in User balance

             const credit = 300;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 7){
             //Credit the amount in User balance

             const credit = 350;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Inactive",
                     tier:"Nil",
                     days:0,
                     time:{
                       minutes: "Nil",
                       hours: "Nil",
                       day: "Nil",
                       month: "Nil",
                       year: "Nil"
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
         }
         if(foundUser.task.tier == "S1"){
         //Validate for Day Count
           if(foundUser.task.days == 1){
             //Credit the amount in User balance

             const credit = 150;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:2,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 2){
             //Credit the amount in User balance

             const credit = 300;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 3){
             //Credit the amount in User balance

             const credit = 450;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 4){
             //Credit the amount in User balance

             const credit = 600;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 5){
             //Credit the amount in User balance

             const credit = 750;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 6){
             //Credit the amount in User balance

             const credit = 1000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 7){
             //Credit the amount in User balance

             const credit = 1250;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Inactive",
                     tier:"Nil",
                     days:0,
                     time:{
                       minutes: "Nil",
                       hours: "Nil",
                       day: "Nil",
                       month: "Nil",
                       year: "Nil"
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
         }
         if(foundUser.task.tier == "S2"){
         //Validate for Day Count
           if(foundUser.task.days == 1){
             //Credit the amount in User balance

             const credit = 300;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:2,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 2){
             //Credit the amount in User balance

             const credit = 600;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 3){
             //Credit the amount in User balance

             const credit = 900;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 4){
             //Credit the amount in User balance

             const credit = 1200;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 5){
             //Credit the amount in User balance

             const credit = 1500;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 6){
             //Credit the amount in User balance

             const credit = 2000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 7){
             //Credit the amount in User balance

             const credit = 2500;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Inactive",
                     tier:"Nil",
                     days:0,
                     time:{
                       minutes: "Nil",
                       hours: "Nil",
                       day: "Nil",
                       month: "Nil",
                       year: "Nil"
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
         }
         if(foundUser.task.tier == "S3"){
         //Validate for Day Count
           if(foundUser.task.days == 1){
             //Credit the amount in User balance

             const credit = 400;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:2,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 2){
             //Credit the amount in User balance

             const credit = 800;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 3){
             //Credit the amount in User balance

             const credit = 1200;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 4){
             //Credit the amount in User balance

             const credit = 1600;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 5){
             //Credit the amount in User balance

             const credit = 2000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 6){
             //Credit the amount in User balance

             const credit = 4000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 7){
             //Credit the amount in User balance

             const credit = 5000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Inactive",
                     tier:"Nil",
                     days:0,
                     time:{
                       minutes: "Nil",
                       hours: "Nil",
                       day: "Nil",
                       month: "Nil",
                       year: "Nil"
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
         }
         if(foundUser.task.tier == "G1"){
         //Validate for Day Count
           if(foundUser.task.days == 1){
             //Credit the amount in User balance

             const credit = 800;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:2,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 2){
             //Credit the amount in User balance

             const credit = 1600;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 3){
             //Credit the amount in User balance

             const credit = 2600;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 4){
             //Credit the amount in User balance

             const credit = 5000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 5){
             //Credit the amount in User balance

             const credit = 8000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 6){
             //Credit the amount in User balance

             const credit = 10000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 7){
             //Credit the amount in User balance

             const credit = 12000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Inactive",
                     tier:"Nil",
                     days:0,
                     time:{
                       minutes: "Nil",
                       hours: "Nil",
                       day: "Nil",
                       month: "Nil",
                       year: "Nil"
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
         }
         if(foundUser.task.tier == "G2"){
         //Validate for Day Count
           if(foundUser.task.days == 1){
             //Credit the amount in User balance

             const credit = 1600;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:2,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 2){
             //Credit the amount in User balance

             const credit = 3400;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 3){
             //Credit the amount in User balance

             const credit = 5000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 4){
             //Credit the amount in User balance

             const credit = 10000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 5){
             //Credit the amount in User balance

             const credit = 15000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 6){
             //Credit the amount in User balance

             const credit = 20000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 7){
             //Credit the amount in User balance

             const credit = 25000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Inactive",
                     tier:"Nil",
                     days:0,
                     time:{
                       minutes: "Nil",
                       hours: "Nil",
                       day: "Nil",
                       month: "Nil",
                       year: "Nil"
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
         }
         if(foundUser.task.tier == "G3"){
         //Validate for Day Count
           if(foundUser.task.days == 1){
             //Credit the amount in User balance

             const credit = 3000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:2,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 2){
             //Credit the amount in User balance

             const credit = 6000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 3){
             //Credit the amount in User balance

             const credit = 9000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 4){
             //Credit the amount in User balance

             const credit = 12000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 5){
             //Credit the amount in User balance

             const credit = 25000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 6){
             //Credit the amount in User balance

             const credit = 45000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Cooldown",
                     tier:foundUser.task.tier,
                     days:foundUser.task.days + 1,
                     time:{
                       minutes: foundUser.task.time.minutes,
                       hours: foundUser.task.time.hours,
                       day: foundUser.task.time.day,
                       month: foundUser.task.time.month,
                       year: foundUser.task.time.year
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
           if(foundUser.task.days == 7){
             //Credit the amount in User balance

             const credit = 60000;
             const trnxID = "T" + String(Math.floor(Math.random()*999999999));
             User.updateOne({email:foundUser.email},
               {$set:{earnings: {
               currentPackage: foundUser.earnings.currentPackage,
               totalPackage: foundUser.earnings.totalPackage,
               totalIncome: foundUser.earnings.totalIncome +Number(credit),
               directIncome: foundUser.earnings.directIncome,
               levelIncome: foundUser.earnings.levelIncome,
               teamAch: foundUser.earnings.teamAch,
               franchiseAch: foundUser.earnings.franchiseAch,
               availableBalance: foundUser.earnings.availableBalance +Number(credit),
               royalIncome: foundUser.earnings.royalIncome +Number(credit)
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 //Transaction Histeory for Weekly income
                   let foundUserTrnx = foundUser.transaction;

                   const newfoundUserTrnx = {
                       type: 'Credit',
                       amount: credit,
                       status: 'Success',
                       from: 'Daily Task',
                       time:{
                         date: date,
                         month: month,
                         year: year
                       },
                       trnxId: trnxID
                   }
                   foundUserTrnx.push(newfoundUserTrnx);
                   User.updateOne({email:foundUser.email}, {$set:{transaction:foundUserTrnx}}, function(err){
                     if(err){
                       console.log(err);
                     }
                   });
                 //Changing the Task Status to Cooldown

                   User.updateOne({email:foundUser.email}, {$set:{task:{
                     status: "Inactive",
                     tier:"Nil",
                     days:0,
                     time:{
                       minutes: "Nil",
                       hours: "Nil",
                       day: "Nil",
                       month: "Nil",
                       year: "Nil"
                     }
                   }}}, function(err){
                     if(err){
                       console.log(err);
                     }else{
                       console.log(foundUser.email + " completed daily task");
                     }
                   });
                   res.status(200).send({task:"Completed"});
                //End of the User Updation process
                 }
             });
           }
         }
       }
     }
   });
 }
});

app.get('/idActivation', (req, res) => {
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{

    User.findOne({email: req.session.user.email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        res.status(200).send({
          name: foundUser.username,
          email: foundUser.email,
          availableBalance: foundUser.earnings.availableBalance,
          alert: 'nil'

        });
      }
      });
  }
});

app.get('/downline', (req, res) => {
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    User.findOne({email:req.session.userl.email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        User.findMany({sposnorID: foundUser.userID}, (err, downlines)=>{
          res.status(200).send({downlines})
        })
      }
    })
  }
})

app.get('/manualOverride/updateTask', function(req, res){
  if(!req.session.admin){
    res.redirect("/adminLogin");
  }else{
    const currentTimeInTimeZone = DateTime.now().setZone(timeZone);
    console.log(`I was run at ${currentTimeInTimeZone.minute}, ${currentTimeInTimeZone.hour}`);

    const scheduledMinute = currentTimeInTimeZone.minute;
    const scheduledHour = currentTimeInTimeZone.hour;
    const scheduledDay = currentTimeInTimeZone.day;
    const scheduledMonth = currentTimeInTimeZone.month;
    const scheduledYear = currentTimeInTimeZone.year;

     User.find({}, function(err, foundUsers){
       if(err){
         console.log(err);
       }else{
         if(!foundUsers){
           console.log('No Users available currently');
         }else{
        // Activating Payment verified user and assigning their timings
           foundUsers.forEach(function(users, i){

          //Checking Active User details
            if(users.task.status == "Cooldown"){
              // if(Number(users.task.time.minutes) == scheduledMinute && Number(users.task.time.hours) == scheduledHour){
              //
              // }

              //Actual Code for the scheduled 7 days count

                  User.updateOne({email:users.email}, {$set:{task:{
                    status: "Active",
                    tier:users.task.tier,
                    days:users.task.days,
                    time:{
                      minutes: users.task.time.minutes,
                      hours: users.task.time.hours,
                      day: users.task.time.day,
                      month: users.task.time.month,
                      year: users.task.time.year
                    }
                  }}}, function(err){
                    if(err){
                      console.log(err);
                    }else{
                      console.log("User Cooldown Activated Successfully", i);

                    }
                  });
            }

            //End of Individual User Task Management!!
           });
         }

       }
     });

  }
});

app.get('/activeUsers', function(req, res){
  if(!req.session.admin){
    res.redirect('/adminLogin');
  }else{
    User.find({}, function(err, foundUsers){
      if(err){
        console.log(err);
      }else{
        res.render('activeUsers', {foundUsers});
      }
    })
  }
});

app.get('/generateQR', async (req, res) => {
  try {
    // Fetch data from MongoDB
    const data = await Data.findOne();
    if (!data) {
      const qr = new Data({
        text: "dummy@upiId"
      });
      qr.save();
      return res.status(404).send('No data found');
    }

    // Generate QR code
    const textToQr = "upi://pay?pa=" + data.text + "&mc=5399&pn=Google Pay Merchant&oobe=fos123&q";
    QRCode.toDataURL(textToQr, (err, url) => {
      if (err) {
        return res.status(500).send('Error generating QR code');
      }
      res.status(200).send({ url });
    });
  } catch (error) {
    res.status(500).send('Server error');
    console.log(error)
  }
});


var job = schedule.scheduleJob('0 * * * * *', function(scheduledTime){
  const timeZone = 'Asia/Kolkata';
  var currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  const currentTimeInTimeZoneScheduled = DateTime.now().setZone(timeZone);

  var scheduledMinute = currentTimeInTimeZoneScheduled.minute;
  var scheduledHour = currentTimeInTimeZoneScheduled.hour;
  var scheduledDay = currentTimeInTimeZoneScheduled.day;
  var scheduledMonth = currentTimeInTimeZoneScheduled.month;
  var scheduledYear = currentTimeInTimeZoneScheduled.year;
  console.log(`I was run at ${currentTimeInTimeZone.minute}, ${currentTimeInTimeZone.hour}`);

   User.find({}, function(err, foundUsers){
     if(err){
       console.log(err);
     }else{
       if(!foundUsers){
         console.log('No Users available currently');
       }else{
      // Activating Payment verified user and assigning their timings
         foundUsers.forEach(function(users){
           if(users.task.status == "Activation Required"){

             User.updateOne({email:users.email}, {$set:{task:{
               status: "Active",
               tier:users.task.tier,
               days:1,
               time:{
                 minutes: scheduledMinute,
                 hours: scheduledHour,
                 day: scheduledDay,
                 month: scheduledMonth,
                 year: scheduledYear
               }
             }}}, function(err){
               if(err){
                 console.log(err);
               }else{
                 console.log(users.email + "User Activated Successfully");
               }
             });
           }

           if(scheduledMinute == 1 && scheduledHour == 1){

          //Checking Active User details
            if(users.task.status == "Cooldown"){
              // if(Number(users.task.time.minutes) == scheduledMinute && Number(users.task.time.hours) == scheduledHour){
              //
              // }

              //Actual Code for the scheduled 7 days count

                  User.updateOne({email:users.email}, {$set:{task:{
                    status: "Active",
                    tier:users.task.tier,
                    days:users.task.days,
                    time:{
                      minutes: users.task.time.minutes,
                      hours: users.task.time.hours,
                      day: users.task.time.day,
                      month: users.task.time.month,
                      year: users.task.time.year
                    }
                  }}}, function(err){
                    if(err){
                      console.log(err);
                    }else{
                      console.log("User Cooldown Activated Successfully");

                    }
                  });
            }
           }
          //End of Individual User Task Management!!
         });
       }

     }
   });

});

//POSTS

app.post("/adminLogin", function(req, res){
  if(process.env.ADMIN === req.body.email){
    if(process.env.PASSWORD === req.body.password){
      req.session.admin = req.body;

      res.redirect('/admin');
    }else{
      //Not an User
      res.redirect('/adminLogin');
    }
  }else{
    //Not an User
    res.redirect('/adminLogin');
  }
}); //adw

app.post('/userPanel', function(req, res){
  if(!req.session.admin){
    res.redirect('/adminLogin');
  }else{
      if(req.body.type == "email"){
        User.findOne({email:req.body.input}, function(err, foundUser){
          if(err){
            console.log(err);
          }else{
            if(!foundUser){
              res.redirect('/admin');
            }else{
              req.session.user = {email:foundUser.email};
              res.redirect("/dashboard");
            }
          }
        });
      }else{
        User.findOne({userID:req.body.input}, function(err, foundUser){
          if(err){
            console.log(err);
          }else{
            if(!foundUser){
              res.redirect('/admin');
            }else{
              req.session.user = {email:foundUser.email};
              res.redirect("/dashboard");
            }
          }
        });
      }
    }
  }); //adw

app.post('/unsetBankDetails', function(req, res){
  if(!req.session.admin){
    res.redirect('/adminLogin');
  }else{
    User.findOne({email:req.body.email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        if(!foundUser){
          res.redirect('/admin');
        }else{
          if(req.body.validation == "CONFIRM"){
            User.updateOne({email:req.body.email}, {$unset:{bankDetails:''}}, function(err){
              if(err){
                console.log(err);
              }else{
                res.redirect('/admin');
              }
            });
          }else{
            res.redirect('/admin');
          }
        }
      }
    });
  }
}); //adw

app.post('/api/login', function(req, res){
  User.findOne({email: req.body.email}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(!foundUser){
        const alertType = "warning";
        const alert = "true";
        const message = "Email or Password Invalid"

        res.status(200).send({alertType, alert, message});
      }else {
        if(req.body.password == foundUser.password){
          req.session.user = req.body;
          const alertType = "success";
          const alert = "true"
          const message = "Login successful..."

          res.status(200).send({alertType, alert, message});
        }else{
          const alertType = "warning";
          const alert = "true"
          const message = "Email or Password Invalid"

          res.status(200).send({alertType, alert, message});
        }
      }
    }
  });
}); //adw

app.post('/api/register', function(req, res){
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  let userID = "CAD" + String(Math.floor(Math.random()*99999));
  const newUser = new User ({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    sponsorID: req.body.sponsorID,
    userID: userID,
    earnings: {
      currentPackage: 0,
      totalPackage: 0,
      totalIncome: 0,
      directIncome: 0,
      levelIncome: 0,
      royalIncome: 0,
      teamAch: 0,
      franchiseAch: 0,
      availableBalance: 0
    },
    task:{
      status: 'Inactive',
      tier: 'Nil',
      days: 0,
      time:{
        hours: 'Nil',
        day: 'Nil',
        month: 'Nil',
        year: 'Nil'
      }
    },
    time: date + "/" + month + "/" + year,
    history: [],

    transaction:[]

  });

  // Unique User Id
  User.findOne({userID: userID}, function(err, foundUser){
    if(err){
      console.log(err);
    } else{
      if(foundUser){
        userID = "CAD" + String(Math.floor(Math.random()*99999));
      }
    }
  });
  User.findOne({email: req.body.email}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        //User already exist
        const alertType = "warning";
        const alert = "true";
        const message = "Username already exist"

        res.status(200).send({alertType, alert, message});
      }else {
        if(req.body.password != req.body.confirmPassword){
          //User already exist
          const alertType = "warning";
          const alert = "true";
          const message = "Password did not match"

          res.status(200).send({alertType, alert, message});
        }else{
          //Save user
          const alertType = "success";
          const alert = "true";
          const message = "Successfully created your Account"

          newUser.save();

          res.status(200).send({alertType, alert, message});
        }
      }
    }
  });
}); //adw

app.post("/api/bankDetails", function(req, res){
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    User.updateOne({email: req.session.user.email}, {$set:{bankDetails:{name: req.body.holdersName, accountNumber: req.body.accountNumber, bankName: req.body.bankName, ifsc: req.body.ifsc}}}, function(err){
      if(err){
        console.log(err);
      }
    });
    User.findOne({email:req.session.user.email}, function(err, foundUser){
      if(err){
        console.log();
      }else{

        const bankDetails = {
          name: req.body.holdersName,
          accountNumber: req.body.accountNumber,
          bankName: req.body.bankName,
          ifsc: req.body.ifsc
        };
        const alert = 'true';
        const alertType = 'success';
        const message = 'Account details updated Successfully'

        res.status(200).send({bankDetails, alertType, alert, message});
      }
    });
  }
}); //adw

app.post("/api/paymentVerification", function(req, res){
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    if(req.body.amount == "" || req.body.trnxId == ""){
      const alertType = "warning";
      const alert = "true";
      const message = "Invalid Input"
      res.status(200).send({alertType, alert, message});
    }else{
      Payment.findOne({trnxId:req.body.trnxId}, function(err, duplicate){
        if(err){
          console.log(err);
        }else{
          if(duplicate){
            const alertType = "warning";
            const alert = "true";
            const message = "Transaction already exist"
            res.status(200).send({alertType, alert, message});
          }else{

          User.findOne({email:req.session.user.email}, function(err, foundUser){
            if(err){
              console.log(err);
            }else{
              Admin.findOne({email:process.env.ADMIN}, function(err, foundAdmin){
                if(err){
                  console.log(err);
                }else{
                  Payment.findOne({}, function(err, foundPayment){
                  //newPayment Details
                  const newPayment = {
                    trnxId: req.body.trnxId,
                    email: foundUser.email,
                    amount: req.body.amount,
                    username: foundUser.username,
                    time:{
                      date: date,
                      month: month,
                      year: year,
                      minutes: minutes,
                      hour: hour
                    },
                    status: req.body.tier
                  }
                  //Saving the Admin details if doesn't exist
                  if(!foundAdmin){
                    const admin = new Admin ({
                      email: process.env.ADMIN,
                      payment:[],
                      withdrawal:[]
                    });
                    admin.save();

                    Admin.updateOne({email:process.env.ADMIN}, {$set:{payment:[newPayment]}}, function(err){
                      if(err){
                        console.log(err);
                      }else{
                        const alertType = "success";
                        const alert = "true";
                        const message = "Payment details submitted."
                        res.status(200).send({alertType, alert, message});
                      }
                    });

                  }else{
                    let pendingPayments = foundAdmin.payment;

                    pendingPayments.push(newPayment);

                    Admin.updateOne({email:process.env.ADMIN}, {$set:{payment:pendingPayments}}, function(err){
                      if(err){
                        console.log(err);
                      }else{
                        const alertType = "success";
                        const alert = "true";
                        const message = "Payment details submitted."
                        res.status(200).send({alertType, alert, message});
                      }
                    });

                  }
                  //Saving User Transaction History
                  const newTransaction = {
                    type: 'Credit',
                    from: 'Invested',
                    amount: req.body.amount,
                    status: 'Pending',
                    time:{
                      date: date,
                      month: month,
                      year: year
                    },
                    trnxId: req.body.trnxId
                  }
                  let history = foundUser.transaction;
                  history.push(newTransaction);


                  User.updateOne({email:foundUser.email}, {$set:{transaction:history}}, function(err){
                    if(err){
                      console.log(err);
                    }
                  });
                  //Saing New Payment into database
                  const newPaymentSchema = new Payment(newPayment);

                  newPaymentSchema.save();
                  });
                }
              });
            }
          });
          }
        }
      });
    }
  }
}); //adw

app.post("/api/paymentGateway", function(req, res){
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    User.findOne({email:req.session.user.email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser.task.status != "Inactive"){
          res.status(200).send({plan: "Already enrolled"});
        }else{
          const amount = req.body.amount;
          const tier = req.body.tier;
          res.status(200).send({amount:amount, tier:tier,plan: "Not enrolled"});

        }
      }
    });
  }
});

app.post("/api/withdrawal", function(req, res){
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
      User.findOne({email: req.session.user.email}, function(err, foundUser){
        if(err){
          console.log(err);
        }else{
            const newValue =  foundUser.earnings.availableBalance - Number(req.body.amount);
            //Minimum Withdrawal
            if(req.body.amount<149){
              const alertType = "warning";
              const alert = "true"
              const message = "Entered amount is less than Minimum withdraw"
              res.status(200).send({alertType:alertType, alert:alert, message:message,
              name: foundUser.username,
              email: foundUser.email,
              sponsorID: foundUser.sponsorID,
              availableBalance: foundUser.earnings.availableBalance
            });
          }  else{
            //lOW BALANCE
            if(foundUser.earnings.availableBalance < req.body.amount){
              const alertType = "warning";
              const alert = "true"
              const message = "Low balance!!"

              res.status(200).send({alertType:alertType, alert:alert, message:message,
                name: foundUser.username,
                email: foundUser.email,
                sponsorID: foundUser.sponsorID,
                availableBalance: foundUser.earnings.availableBalance
              });
            }else{
            //No Bank details
              if(!foundUser.bankDetails){
                const alertType = "warning";
                const alert = "true"
                const message = "Fill in you Bank Details to proceed"

                res.status(200).send({alertType:alertType, alert:alert, message:message,
                  name: foundUser.username,
                  email: foundUser.email,
                  sponsorID: foundUser.sponsorID,
                  availableBalance: foundUser.earnings.availableBalance
                });
              }else{
                let limitReached = false;
                foundUser.transaction.forEach(function(transaction){
                  if(transaction.from == "Withdraw"){
                    if(transaction.status != 'Failed'){
                      if(transaction.time.date == date && transaction.time.month == month){
                        limitReached = true;
                      }
                    }
                  }
                });
                if(limitReached == true){
                  const alertType = "warning";
                  const alert = "true"
                  const message = "Daily Withdrawal limit reached"

                  res.status(200).send({alertType:alertType, alert:alert, message:message,
                    name: foundUser.username,
                    email: foundUser.email,
                    sponsorID: foundUser.sponsorID,
                    availableBalance: foundUser.earnings.availableBalance
                  });
                }else{
                //New balnce update
                User.updateOne({email: req.session.user.email},
                  {$set:
                    {earnings:
                      {
                      currentPackage: foundUser.earnings.currentPackage,
                      totalPackage: foundUser.earnings.totalPackage,
                      totalIncome: foundUser.earnings.totalIncome,
                      directIncome: foundUser.earnings.directIncome,
                      levelIncome: foundUser.earnings.levelIncome,
                      royalIncome: foundUser.earnings.royalIncome,
                      teamAch: foundUser.earnings.teamAch,
                      franchiseAch: foundUser.earnings.franchiseAch,
                      availableBalance: newValue
                      }}}, function(error){
                  if(error){
                    console.log(error);
                  }else{
                    const trnxID = "T" + String(Math.floor(Math.random()*999999999));
                    //History and Transaction add up
                    let history = foundUser.history;
                    let transaction = foundUser.transaction;
                    const newTransaction = {
                      type: 'Debit',
                      from: 'Withdraw',
                      amount: req.body.amount,
                      status: 'Pending',
                      time:{
                        date: date,
                        month: month,
                        year: year
                      },
                      trnxId: trnxID
                    }
                    transaction.push(newTransaction);

                    User.updateOne({email: req.session.user.email}, {$set:{transaction:transaction}}, function(error){
                      if(error){
                        console.log(error);
                      }
                    });

                    Admin.findOne({email:process.env.ADMIN}, function(err, foundAdmin){
                      if(err){
                        console.log(err);
                      }else{
                        let withdrawal = foundAdmin.withdrawal;
                        const newWithdrawal = {
                          trnxId: trnxID,
                          amount: req.body.amount,
                          email: foundUser.email,
                          username: foundUser.username,
                          time:{
                            date: date,
                            month: month,
                            year: foundUser.bankDetails.bankName,
                            minutes: foundUser.bankDetails.accountNumber,
                            hour: foundUser.bankDetails.ifsc
                          }
                        }
                        withdrawal.push(newWithdrawal);
                        Admin.updateOne({email:process.env.ADMIN}, {$set:{withdrawal:withdrawal}}, function(err){
                          if(err){
                            console.log(err);
                          }
                        });
                      }
                    });
                    const alert = 'true';
                    const alertType = 'success';
                    const message = 'Withdrawal Success'

                    res.status(200).send({
                      alert:alert,
                      alertType:alertType,
                      message:message,
                      availableBalance: newValue
                    });
                  }
                });
                }
              }
            }
          }
        }

      });
  }

});

app.post('/planActivation', function(req, res){
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  if(!req.session.admin){
    res.redirect('/adminLogin')
  }else{
    User.findOne({email:req.body.email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        Admin.findOne({email:process.env.ADMIN}, function(err, foundAdmin){
          if(err){
            console.log(err);
          }else{
            Payment.findOne({trnxId:req.body.trnxId}, function(err, foundPayment){
              if(err){
                console.log(err);
              }else{
                if(req.body.approval == "false"){
                  //Handle for payment failure
                  // Removing payment details from admin payment array
                  const pendingPayments = [];

                  foundAdmin.payment.forEach(function(payment){
                    if(req.body.trnxId != payment.trnxId){
                      pendingPayments.push(payment);
                    }
                  });
                  Admin.updateOne({email:process.env.ADMIN}, {$set:{payment:pendingPayments}}, function(err){
                    if(err){
                      console.log(err);
                    }
                  });
                  // Changing payment status failed in Payment database
                  Payment.updateOne({trnxId:req.body.trnxId},
                     {$set:{trnxId:'Failed transaction - ' + req.body.trnxId}},
                      function(err){
                        if(err){
                          console.log(err);
                        }
                      });

                  //Updating Transaction History Failed in User's Transaction Array
                  let updatedTransaction = [];

                  foundUser.transaction.forEach(function(transaction){
                    if(transaction.trnxId == req.body.trnxId){
                      const newTrnx = {
                        type: transaction.type,
                        from: transaction.from,
                        amount: transaction.amount,
                        status: 'Failed',
                        time:{
                          date: transaction.time.date,
                          month: transaction.time.month,
                          year: transaction.time.year
                        },
                        trnxId: transaction.trnxId
                      }
                      updatedTransaction.push(newTrnx);
                    }else{
                      updatedTransaction.push(transaction);
                    }
                  });

                  //Updating Transaction array for User
                  User.updateOne({email:req.body.email}, {$set:{transaction:updatedTransaction}}, function(err){
                    if(err){
                      console.log(err);
                    }
                  });

                }else{
                  // Handle for payment success event
                  // Updating task details for user to start with weekly income loop
                  User.updateOne({email:req.body.email}, {$set:{task:{
                    status: "Activation Required",
                    tier: req.body.tier,
                    days: 0,
                    time:{
                      hours: "Nil",
                      day: "Nil",
                      month: "Nil",
                      year: "Nil"
                    }
                  }}}, function(err){
                    if(err){
                      console.log(err);
                    }else{
                      //Updation Current Activatet Package amount
                      User.updateOne({email:req.body.email},
                        {$set:{earnings: {
                        currentPackage: Number(req.body.amount),
                        totalPackage: foundUser.earnings.totalPackage + Number(req.body.amount),
                        totalIncome: foundUser.earnings.totalIncome,
                        directIncome: foundUser.earnings.directIncome,
                        levelIncome: foundUser.earnings.levelIncome,
                        royalIncome: foundUser.earnings.royalIncome,
                        teamAch: foundUser.earnings.teamAch,
                        franchiseAch: foundUser.earnings.franchiseAch,
                        availableBalance: foundUser.earnings.availableBalance
                      }}}, function(err){
                        if(err){
                          console.log(err);
                        }
                      });
                      //Updating Transaction History Success in User's Transaction Array
                      let updatedTransaction = [];

                      foundUser.transaction.forEach(function(transaction){
                        if(transaction.trnxId == req.body.trnxId){
                          const newTrnx = {
                            type: transaction.type,
                            from: transaction.from,
                            amount: transaction.amount,
                            status: 'Success',
                            time:{
                              date: transaction.time.date,
                              month: transaction.time.month,
                              year: transaction.time.year
                            },
                            trnxId: transaction.trnxId
                          }
                          updatedTransaction.push(newTrnx);
                        }else{
                          updatedTransaction.push(transaction);
                        }
                      });

                      //Updating Transaction array for User
                      User.updateOne({email:req.body.email}, {$set:{transaction:updatedTransaction}}, function(err){
                        if(err){
                          console.log(err);
                        }
                      });
                      //Direct Income credit logic
                      User.findOne({userID:foundUser.sponsorID}, function(err, sponsorUser){
                        if(err){
                          console.log(err);
                        }else{
                          if(sponsorUser){
                            // Updating user balance for 10% Direct income for the  direct user
                              //Updating Direct income
                              User.updateOne({userID: foundUser.sponsorID},
                                {$set:{earnings: {
                                currentPackage: sponsorUser.earnings.currentPackage,
                                totalPackage: sponsorUser.earnings.totalPackage,
                                totalIncome: sponsorUser.earnings.totalIncome + Math.floor(Number(req.body.amount)*.1) ,
                                directIncome: sponsorUser.earnings.directIncome + Math.floor(Number(req.body.amount)*.1) ,
                                levelIncome: sponsorUser.earnings.levelIncome,
                                royalIncome: sponsorUser.earnings.royalIncome,
                                teamAch: sponsorUser.earnings.teamAch +Number(req.body.amount),
                                franchiseAch: sponsorUser.earnings.franchiseAch,
                                availableBalance: sponsorUser.earnings.availableBalance + Number(req.body.amount)*.1
                              }}}, function(err){
                                if(err){
                                  console.log(err);
                                }else{
                                    //updating Transaction history for Sponsor
                                    let sponsorTrnx = sponsorUser.transaction;

                                    const newSponsorTrnx = {
                                        type: 'Credit',
                                        from: foundUser.username,
                                        amount: req.body.amount*0.1,
                                        status: 'Success',
                                        incomeType: 'Direct',
                                        userID: foundUser.userID,
                                        time:{
                                          date: date,
                                          month: month,
                                          year: year
                                        },
                                        trnxId: req.body.trnxId
                                    }
                                    sponsorTrnx.push(newSponsorTrnx);
                                    User.updateOne({userID: foundUser.sponsorID}, {$set:{transaction:sponsorTrnx}}, function(err){
                                      if(err){
                                        console.log(err);
                                      }
                                    });
                                  }
                              });

                              //Level income logic
                              User.findOne({userID: sponsorUser.sponsorID}, function(err, level1User){
                                if(err){
                                  console.log(err);
                                }else{
                                  if(level1User){

                                      //Updating Level 1 income
                                      User.updateOne({userID: sponsorUser.sponsorID},
                                        {$set:{earnings: {
                                        currentPackage: level1User.earnings.currentPackage,
                                        totalPackage: level1User.earnings.totalPackage,
                                        totalIncome: level1User.earnings.totalIncome + Math.floor(Number(req.body.amount)*.02) ,
                                        directIncome: level1User.earnings.directIncome,
                                        levelIncome: level1User.earnings.levelIncome + Math.floor(Number(req.body.amount)*.02),
                                        royalIncome: level1User.earnings.royalIncome,
                                        teamAch: level1User.earnings.teamAch,
                                        franchiseAch: level1User.earnings.franchiseAch,
                                        availableBalance: level1User.earnings.availableBalance + Math.floor(Number(req.body.amount)*.02)
                                      }}}, function(err){
                                        if(err){
                                          console.log(err);
                                        }else{
                                            //updating Transaction history for Level 1 User
                                            let level1Trnx = level1User.transaction;

                                            const newlevel1Trnx = {
                                                type: 'Credit',
                                                from: foundUser.username,
                                                amount: req.body.amount*0.02,
                                                status: 'Success',
                                                incomeType: 'Level',
                                                userID: foundUser.userID,
                                                time:{
                                                  date: date,
                                                  month: month,
                                                  year: year
                                                },
                                                trnxId: req.body.trnxId
                                            }
                                            level1Trnx.push(newlevel1Trnx);
                                            User.updateOne({userID: sponsorUser.sponsorID}, {$set:{transaction:level1Trnx}}, function(err){
                                              if(err){
                                                console.log(err);
                                              }
                                            });
                                          }
                                      });
                                    //User 1 Income updation Ends Here

                                    User.findOne({userID: level1User.sponsorID}, function(err, level2User){
                                      if(err){
                                        console.log(err);
                                      }else{
                                        if(level2User){
                                          //User 2 Income updation

                                              //Updating Level 2 income
                                              User.updateOne({userID: level1User.sponsorID},
                                                {$set:{earnings: {
                                                currentPackage: level2User.earnings.currentPackage,
                                                totalPackage: level2User.earnings.totalPackage,
                                                totalIncome: level2User.earnings.totalIncome + Math.floor(Number(req.body.amount)*.01) ,
                                                directIncome: level2User.earnings.directIncome,
                                                levelIncome: level2User.earnings.levelIncome + Math.floor(Number(req.body.amount)*.01),
                                                royalIncome: level2User.earnings.royalIncome,
                                                teamAch: level2User.earnings.teamAch,
                                                franchiseAch: level2User.earnings.franchiseAch,
                                                availableBalance: level2User.earnings.availableBalance + Math.floor(Number(req.body.amount)*.01)
                                              }}}, function(err){
                                                if(err){
                                                  console.log(err);
                                                }else{
                                                    //updating Transaction history for Level 1 User
                                                    let level2Trnx = level2User.transaction;

                                                    const newlevel2Trnx = {
                                                        type: 'Credit',
                                                        from: foundUser.username,
                                                        amount: req.body.amount*0.01,
                                                        status: 'Success',
                                                        incomeType: 'Level',
                                                        userID: foundUser.userID,
                                                        time:{
                                                          date: date,
                                                          month: month,
                                                          year: year
                                                        },
                                                        trnxId: req.body.trnxId
                                                    }
                                                    level2Trnx.push(newlevel2Trnx);
                                                    User.updateOne({userID: level1User.sponsorID}, {$set:{transaction:level2Trnx}}, function(err){
                                                      if(err){
                                                        console.log(err);
                                                      }
                                                    });
                                                  }
                                              });
                                            //User 2 Income updation Ends Here
                                          User.findOne({userID: level2User.sponsorID}, function(err, level3User){
                                            if(err){
                                              console.log(err);
                                            }else{
                                              if(level3User){
                                                //User 3 Income updation

                                                    //Updating Level 3 income
                                                    User.updateOne({userID: level2User.sponsorID},
                                                      {$set:{earnings: {
                                                      currentPackage: level3User.earnings.currentPackage,
                                                      totalPackage: level3User.earnings.totalPackage,
                                                      totalIncome: level3User.earnings.totalIncome + Math.floor(Number(req.body.amount)*.01) ,
                                                      directIncome: level3User.earnings.directIncome,
                                                      levelIncome: level3User.earnings.levelIncome + Math.floor(Number(req.body.amount)*.01),
                                                      royalIncome: level3User.earnings.royalIncome,
                                                      teamAch: level3User.earnings.teamAch,
                                                      franchiseAch: level3User.earnings.franchiseAch,
                                                      availableBalance: level3User.earnings.availableBalance + Math.floor(Number(req.body.amount)*.01)
                                                    }}}, function(err){
                                                      if(err){
                                                        console.log(err);
                                                      }else{
                                                          //updating Transaction history for Level 1 User
                                                          let level3Trnx = level3User.transaction;

                                                          const newlevel3Trnx = {
                                                              type: 'Credit',
                                                              from: foundUser.username,
                                                              amount: req.body.amount*0.01,
                                                              status: 'Success',
                                                              incomeType: 'Level',
                                                              userID: foundUser.userID,
                                                              time:{
                                                                date: date,
                                                                month: month,
                                                                year: year
                                                              },
                                                              trnxId: req.body.trnxId
                                                          }
                                                          level3Trnx.push(newlevel3Trnx);
                                                          User.updateOne({userID: level2User.sponsorID}, {$set:{transaction:level3Trnx}}, function(err){
                                                            if(err){
                                                              console.log(err);
                                                            }
                                                          });
                                                        }
                                                    });
                                                  //User 3 Income updation Ends Here
                                                User.findOne({userID: level3User.sponsorID}, function(err, level4User){
                                                  if(err){
                                                    console.log(err);
                                                  }else{
                                                    if(level4User){
                                                      //User 4 Income updation

                                                          //Updating Level 4 income
                                                          User.updateOne({userID: level3User.sponsorID},
                                                            {$set:{earnings: {
                                                            currentPackage: level4User.earnings.currentPackage,
                                                            totalPackage: level4User.earnings.totalPackage,
                                                            totalIncome: level4User.earnings.totalIncome + Math.floor(Number(req.body.amount)*.01) ,
                                                            directIncome: level4User.earnings.directIncome,
                                                            levelIncome: level4User.earnings.levelIncome + Math.floor(Number(req.body.amount)*.01),
                                                            royalIncome: level4User.earnings.royalIncome,
                                                            teamAch: level4User.earnings.teamAch,
                                                            franchiseAch: level4User.earnings.franchiseAch,
                                                            availableBalance: level4User.earnings.availableBalance + Math.floor(Number(req.body.amount)*.01)
                                                          }}}, function(err){
                                                            if(err){
                                                              console.log(err);
                                                            }else{
                                                                //updating Transaction history for Level 1 User
                                                                let level4Trnx = level4User.transaction;

                                                                const newlevel4Trnx = {
                                                                    type: 'Credit',
                                                                    from: foundUser.username,
                                                                    amount: req.body.amount*0.01,
                                                                    status: 'Success',
                                                                    incomeType: 'Level',
                                                                    userID: foundUser.userID,
                                                                    time:{
                                                                      date: date,
                                                                      month: month,
                                                                      year: year
                                                                    },
                                                                    trnxId: req.body.trnxId
                                                                }
                                                                level4Trnx.push(newlevel4Trnx);
                                                                User.updateOne({userID: level3User.sponsorID}, {$set:{transaction:level4Trnx}}, function(err){
                                                                  if(err){
                                                                    console.log(err);
                                                                  }
                                                                });
                                                              }
                                                          });
                                                        //User 4 Income updation Ends Here

                                                    }
                                                  }
                                                });
                                              }
                                            }
                                          });
                                        }
                                      }
                                    });
                                  }
                                }
                              });
                          }
                        }
                      });


                    }
                  });

                  // Removing payment details from admin payment array
                  const pendingPayments = [];

                  foundAdmin.payment.forEach(function(payment){
                    if(req.body.trnxId != payment.trnxId){
                      pendingPayments.push(payment);
                    }
                  });
                  Admin.updateOne({email:process.env.ADMIN}, {$set:{payment:pendingPayments}}, function(err){
                    if(err){
                      console.log(err);
                    }
                  });
                  // Updating trnx success in Payment database
                  Payment.updateOne({trnxId:req.body.trnxId},
                     {$set:{status:'success'}},
                      function(err){
                        if(err){
                          console.log(err);
                        }
                      });
                }
              }
            })
          }
        });
      }
    });
    res.redirect('/admin');
  }
});

app.post("/api/creditWithdrawal", function(req, res){
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  if(!req.session.admin){
    res.redirect('/adminLogin')
  }else{
    if(req.body.approval == 'true'){
    Admin.findOne({email:process.env.ADMIN}, function(err, foundAdmin){
      if(err){
        console.log(err);
      }else{
        User.findOne({email:req.body.email}, function(err, foundUser){
          if(err){
            console.log(err);
          }else{

            //Updating Transaction History Success
            let updatedTransaction = [];

            foundUser.transaction.forEach(function(transaction){
              if(transaction.trnxId == req.body.trnxId){
                const newTrnx = {
                  type: transaction.type,
                  from: transaction.from,
                  amount: transaction.amount,
                  status: 'Success',
                  time:{
                    date: transaction.time.date,
                    month: transaction.time.month,
                    year: transaction.time.year
                  },
                  trnxId: transaction.trnxId
                }
                updatedTransaction.push(newTrnx);
              }else{
                updatedTransaction.push(transaction);
              }
            });
            //Updating Transaction array for User
            User.updateOne({email:req.body.email}, {$set:{transaction:updatedTransaction}}, function(err){
              if(err){
                console.log(err);
              }
            });

            //Update admin array
            let updatedArray = [];

            foundAdmin.withdrawal.forEach(function(transaction){
              if(transaction.trnxId != req.body.trnxId){
                updatedArray.push(transaction);
              }
            });
            Admin.updateOne({email:process.env.ADMIN}, {$set:{withdrawal:updatedArray}}, function(err){
              if(err){
                console.log(err);
              }
            });

          }
        });
      }
    });
    }else{

      Admin.findOne({email:process.env.ADMIN}, function(err, foundAdmin){
        if(err){
          console.log(err);
        }else{
          User.findOne({email:req.body.email}, function(err, foundUser){
            if(err){
              console.log(err);
            }else{
              //Updating User balance

              User.updateOne({email: req.body.email}, {$set:{earnings: {
                currentPackage: foundUser.earnings.currentPackage,
                totalPackage: foundUser.earnings.totalPackage,
                totalIncome: foundUser.earnings.totalIncome,
                directIncome: foundUser.earnings.directIncome,
                levelIncome: foundUser.earnings.levelIncome,
                royalIncome: foundUser.earnings.royalIncome,
                teamAch: foundUser.earnings.teamAch,
                franchiseAch: foundUser.earnings.franchiseAch,
                availableBalance: foundUser.earnings.availableBalance + Math.floor(Number(req.body.amount))
              }}},function(err){
                if(err){
                  console.log(err);
                }
              });

              //Updating Transaction History Success
              let updatedTransaction = [];

              foundUser.transaction.forEach(function(transaction){
                if(transaction.trnxId == req.body.trnxId){
                  const newTrnx = {
                    type: transaction.type,
                    from: transaction.from,
                    amount: transaction.amount,
                    status: 'Failed',
                    time:{
                      date: transaction.time.date,
                      month: transaction.time.month,
                      year: transaction.time.year
                    },
                    trnxId: transaction.trnxId
                  }
                  updatedTransaction.push(newTrnx);
                }else{
                  updatedTransaction.push(transaction);
                }
              });
              //Updating Transaction array for User
              User.updateOne({email:req.body.email}, {$set:{transaction:updatedTransaction}}, function(err){
                if(err){
                  console.log(err);
                }
              });

              //Update admin array
              let updatedArray = [];

              foundAdmin.withdrawal.forEach(function(transaction){
                if(transaction.trnxId != req.body.trnxId){
                  updatedArray.push(transaction);
                }
              });
              Admin.updateOne({email:process.env.ADMIN}, {$set:{withdrawal:updatedArray}}, function(err){
                if(err){
                  console.log(err);
                }
              });

            }
          });
        }
      });
    }
    res.redirect('/admin');
  }
}); //wts

app.post("/updateTaskLink", function(req, res){
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  if(!req.session.admin){
    res.redirect("/adminLogin");
  }else{
    Admin.updateOne({email:process.env.ADMIN}, {$set:{taskLink:req.body.taskLink}}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Video Link Updated Successfully");
      }
    });
  }
}); //adw

app.post('/idActivateValidation', (req, res)=>{
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{
    User.findOne({email:req.body.email}, (err, foundUser) =>{
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          const idUserEmail = foundUser.email;
          const tier = req.body.tier;
          const amount = req.body.amount;
          res.status(200).send({idUserEmail:idUserEmail, tier:tier, amount:amount, foundUser: "User found"});
        }else{

          const tier = req.body.tier;
          const amount = req.body.amount;
          res.status(200).send({tier:tier, amount:amount, foundUser: "User not found"});
        }
      }
    })
  }
});  //adw

app.post('/idActivation', (req, res)=>{
  const timeZone = 'Asia/Kolkata';
  const currentTimeInTimeZone = DateTime.now().setZone(timeZone);


  let year = currentTimeInTimeZone.year;
  let month = currentTimeInTimeZone.month;
  let date = currentTimeInTimeZone.day;
  let hour = currentTimeInTimeZone.hour;
  let minutes = currentTimeInTimeZone.minute;
  if(!req.session.user){
    res.status(200).send({redirect:true});
  }else{

      User.findOne({email:req.body.email}, function(err, foundUser){
        if(err){
          console.log(err);
        }else{
          User.findOne({email:req.session.user.email}, function(err, foundActivator){
            if(err){
              console.log(err);
            }else{
              Payment.findOne({trnxId:req.body.trnxId}, function(err, foundPayment){
                if(err){
                  console.log(err);
                }else{
                  const newValue =  foundActivator.earnings.availableBalance - Number(req.body.amount);

                  if(foundUser.task.status != "Inactive"){
                    const alertType = "warning";
                    const alert = "true"
                    const message = "Cannot Enroll for more than one plan!!"
                    res.status(200).send({
                      alertType:alertType,
                      alert:alert,
                      message:message,
                      availableBalance: foundActivator.earnings.availableBalance
                    });
                  }else{
                    if(foundActivator.earnings.availableBalance < req.body.amount){
                      const alertType = "warning";
                      const alert = "true"
                      const message = "Low balance, You do not have sufficient balance!"
                      res.status(200).send({
                        alertType:alertType,
                        alert:alert,
                        message:message,
                        availableBalance: foundActivator.earnings.availableBalance
                      });
                    }else{
                      const trnxID = "T" + String(Math.floor(Math.random()*999999999));
                      const activationID = "TID" + String(Math.floor(Math.random()*999999999))
                      const alertType = "success";
                      const alert = "true"
                      const message = "ID activation successful"
                      res.status(200).send({
                        alertType:alertType,
                        alert:alert,
                        message:message,
                        availableBalance: newValue
                      });
                      //New balnce update
                      User.updateOne({email: req.session.user.email},
                        {$set:
                          {earnings:
                            {
                            currentPackage: foundActivator.earnings.currentPackage,
                            totalPackage: foundActivator.earnings.totalPackage,
                            totalIncome: foundActivator.earnings.totalIncome,
                            directIncome: foundActivator.earnings.directIncome,
                            levelIncome: foundActivator.earnings.levelIncome,
                            royalIncome: foundActivator.earnings.royalIncome,
                            teamAch: foundActivator.earnings.teamAch,
                            franchiseAch: foundActivator.earnings.franchiseAch,
                            availableBalance: newValue
                            }}}, function(error){
                        if(error){
                          console.log(error);
                        }else{
                          //History and Transaction add up
                          let history = foundActivator.history;
                          let transaction = foundActivator.transaction;
                          const newTransaction = {
                            type: 'Debit',
                            from: 'ID Activation',
                            amount: req.body.amount,
                            status: 'Success',
                            time:{
                              date: date,
                              month: month,
                              year: year
                            },
                            trnxId: activationID
                          }
                          transaction.push(newTransaction);

                          User.updateOne({email: req.session.user.email}, {$set:{transaction:transaction}}, function(error){
                            if(error){
                              console.log(error);
                            }
                          });
                        }
                      });

                      // Handle for payment success event
                      // Updating task details for user to start with weekly income loop
                      User.updateOne({email:req.body.email}, {$set:{task:{
                        status: "Activation Required",
                        tier: req.body.tier,
                        days: 0,
                        time:{
                          hours: "Nil",
                          day: "Nil",
                          month: "Nil",
                          year: "Nil"
                        }
                      }}}, function(err){
                        if(err){
                          console.log(err);
                        }else{
                          //Updation Current Activatet Package amount
                          User.updateOne({email:req.body.email},
                            {$set:{earnings: {
                            currentPackage: Number(req.body.amount),
                            totalPackage: foundUser.earnings.totalPackage,
                            totalIncome: foundUser.earnings.totalIncome,
                            directIncome: foundUser.earnings.directIncome,
                            levelIncome: foundUser.earnings.levelIncome,
                            royalIncome: foundUser.earnings.royalIncome,
                            teamAch: foundUser.earnings.teamAch,
                            franchiseAch: foundUser.earnings.franchiseAch + Number(req.body.amount),
                            availableBalance: foundUser.earnings.availableBalance
                          }}}, function(err){
                            if(err){
                              console.log(err);
                            }
                          });
                          //Updating Transaction History Success in User's Transaction Array
                          let updatedTransaction = [];

                          foundUser.transaction.forEach(function(transaction){
                            if(transaction.trnxId == req.body.trnxId){
                            //Saving User Transaction History
                            const newTrnx = {
                              type: 'Credit',
                              from: 'Invested',
                              amount: req.body.amount,
                              status: 'Success',
                              time:{
                                date: date,
                                month: month,
                                year: year
                              },
                              trnxId: trnxID
                            }
                              updatedTransaction.push(newTrnx);
                            }else{
                              updatedTransaction.push(transaction);
                            }
                          });

                          //Updating Transaction array for User
                          User.updateOne({email:req.body.email}, {$set:{transaction:updatedTransaction}}, function(err){
                            if(err){
                              console.log(err);
                            }
                          });
                          //Direct Income credit logic
                          User.findOne({userID:foundUser.sponsorID}, function(err, sponsorUser){
                            if(err){
                              console.log(err);
                            }else{
                              if(sponsorUser){
                                // Updating user balance for 10% Direct income for the  direct user
                                  //Updating Direct income
                                  User.updateOne({userID: foundUser.sponsorID},
                                    {$set:{earnings: {
                                    currentPackage: sponsorUser.earnings.currentPackage,
                                    totalPackage: sponsorUser.earnings.totalPackage,
                                    totalIncome: sponsorUser.earnings.totalIncome + Math.floor(Number(req.body.amount)*.1) ,
                                    directIncome: sponsorUser.earnings.directIncome + Math.floor(Number(req.body.amount)*.1) ,
                                    levelIncome: sponsorUser.earnings.levelIncome,
                                    royalIncome: sponsorUser.earnings.royalIncome,
                                    teamAch: sponsorUser.earnings.teamAch +Number(req.body.amount),
                                    franchiseAch: sponsorUser.earnings.franchiseAch,
                                    availableBalance: sponsorUser.earnings.availableBalance + Number(req.body.amount)*.1
                                  }}}, function(err){
                                    if(err){
                                      console.log(err);
                                    }else{
                                        //updating Transaction history for Sponsor
                                        let sponsorTrnx = sponsorUser.transaction;

                                        const newSponsorTrnx = {
                                            type: 'Credit',
                                            from: foundUser.username,
                                            amount: req.body.amount*0.1,
                                            status: 'Success',
                                            incomeType: 'Direct',
                                            userID: foundUser.userID,
                                            time:{
                                              date: date,
                                              month: month,
                                              year: year
                                            },
                                            trnxId: trnxID
                                        }
                                        sponsorTrnx.push(newSponsorTrnx);
                                        User.updateOne({userID: foundUser.sponsorID}, {$set:{transaction:sponsorTrnx}}, function(err){
                                          if(err){
                                            console.log(err);
                                          }
                                        });
                                      }
                                  });

                                  //Level income logic
                                  User.findOne({userID: sponsorUser.sponsorID}, function(err, level1User){
                                    if(err){
                                      console.log(err);
                                    }else{
                                      if(level1User){

                                          //Updating Level 1 income
                                          User.updateOne({userID: sponsorUser.sponsorID},
                                            {$set:{earnings: {
                                            currentPackage: level1User.earnings.currentPackage,
                                            totalPackage: level1User.earnings.totalPackage,
                                            totalIncome: level1User.earnings.totalIncome + Math.floor(Number(req.body.amount)*.02) ,
                                            directIncome: level1User.earnings.directIncome,
                                            levelIncome: level1User.earnings.levelIncome + Math.floor(Number(req.body.amount)*.02),
                                            royalIncome: level1User.earnings.royalIncome,
                                            teamAch: level1User.earnings.teamAch +Number(req.body.amount),
                                            franchiseAch: level1User.earnings.franchiseAch,
                                            availableBalance: level1User.earnings.availableBalance + Math.floor(Number(req.body.amount)*.02)
                                          }}}, function(err){
                                            if(err){
                                              console.log(err);
                                            }else{
                                                //updating Transaction history for Level 1 User
                                                let level1Trnx = level1User.transaction;

                                                const newlevel1Trnx = {
                                                    type: 'Credit',
                                                    from: foundUser.username,
                                                    amount: req.body.amount*0.02,
                                                    status: 'Success',
                                                    incomeType: 'Level',
                                                    userID: foundUser.userID,
                                                    time:{
                                                      date: date,
                                                      month: month,
                                                      year: year
                                                    },
                                                    trnxId: trnxID
                                                }
                                                level1Trnx.push(newlevel1Trnx);
                                                User.updateOne({userID: sponsorUser.sponsorID}, {$set:{transaction:level1Trnx}}, function(err){
                                                  if(err){
                                                    console.log(err);
                                                  }
                                                });
                                              }
                                          });
                                        //User 1 Income updation Ends Here

                                        User.findOne({userID: level1User.sponsorID}, function(err, level2User){
                                          if(err){
                                            console.log(err);
                                          }else{
                                            if(level2User){
                                              //User 2 Income updation

                                                  //Updating Level 2 income
                                                  User.updateOne({userID: level1User.sponsorID},
                                                    {$set:{earnings: {
                                                    currentPackage: level2User.earnings.currentPackage,
                                                    totalPackage: level2User.earnings.totalPackage,
                                                    totalIncome: level2User.earnings.totalIncome + Math.floor(Number(req.body.amount)*.01) ,
                                                    directIncome: level2User.earnings.directIncome,
                                                    levelIncome: level2User.earnings.levelIncome + Math.floor(Number(req.body.amount)*.01),
                                                    royalIncome: level2User.earnings.royalIncome,
                                                    teamAch: level2User.earnings.teamAch +Number(req.body.amount),
                                                    franchiseAch: level2User.earnings.franchiseAch,
                                                    availableBalance: level2User.earnings.availableBalance + Math.floor(Number(req.body.amount)*.01)
                                                  }}}, function(err){
                                                    if(err){
                                                      console.log(err);
                                                    }else{
                                                        //updating Transaction history for Level 1 User
                                                        let level2Trnx = level2User.transaction;

                                                        const newlevel2Trnx = {
                                                            type: 'Credit',
                                                            from: foundUser.username,
                                                            amount: req.body.amount*0.01,
                                                            status: 'Success',
                                                            incomeType: 'Level',
                                                            userID: foundUser.userID,
                                                            time:{
                                                              date: date,
                                                              month: month,
                                                              year: year
                                                            },
                                                            trnxId: trnxID
                                                        }
                                                        level2Trnx.push(newlevel2Trnx);
                                                        User.updateOne({userID: level1User.sponsorID}, {$set:{transaction:level2Trnx}}, function(err){
                                                          if(err){
                                                            console.log(err);
                                                          }
                                                        });
                                                      }
                                                  });
                                                //User 2 Income updation Ends Here
                                              User.findOne({userID: level2User.sponsorID}, function(err, level3User){
                                                if(err){
                                                  console.log(err);
                                                }else{
                                                  if(level3User){
                                                    //User 3 Income updation

                                                        //Updating Level 3 income
                                                        User.updateOne({userID: level2User.sponsorID},
                                                          {$set:{earnings: {
                                                          currentPackage: level3User.earnings.currentPackage,
                                                          totalPackage: level3User.earnings.totalPackage,
                                                          totalIncome: level3User.earnings.totalIncome + Math.floor(Number(req.body.amount)*.01) ,
                                                          directIncome: level3User.earnings.directIncome,
                                                          levelIncome: level3User.earnings.levelIncome + Math.floor(Number(req.body.amount)*.01),
                                                          royalIncome: level3User.earnings.royalIncome,
                                                          teamAch: level3User.earnings.teamAch +Number(req.body.amount),
                                                          franchiseAch: level3User.earnings.franchiseAch,
                                                          availableBalance: level3User.earnings.availableBalance + Math.floor(Number(req.body.amount)*.01)
                                                        }}}, function(err){
                                                          if(err){
                                                            console.log(err);
                                                          }else{
                                                              //updating Transaction history for Level 1 User
                                                              let level3Trnx = level3User.transaction;

                                                              const newlevel3Trnx = {
                                                                  type: 'Credit',
                                                                  from: foundUser.username,
                                                                  amount: req.body.amount*0.01,
                                                                  status: 'Success',
                                                                  incomeType: 'Level',
                                                                  userID: foundUser.userID,
                                                                  time:{
                                                                    date: date,
                                                                    month: month,
                                                                    year: year
                                                                  },
                                                                  trnxId: trnxID
                                                              }
                                                              level3Trnx.push(newlevel3Trnx);
                                                              User.updateOne({userID: level2User.sponsorID}, {$set:{transaction:level3Trnx}}, function(err){
                                                                if(err){
                                                                  console.log(err);
                                                                }
                                                              });
                                                            }
                                                        });
                                                      //User 3 Income updation Ends Here
                                                    User.findOne({userID: level3User.sponsorID}, function(err, level4User){
                                                      if(err){
                                                        console.log(err);
                                                      }else{
                                                        if(level4User){
                                                          //User 4 Income updation

                                                              //Updating Level 4 income
                                                              User.updateOne({userID: level3User.sponsorID},
                                                                {$set:{earnings: {
                                                                currentPackage: level4User.earnings.currentPackage,
                                                                totalPackage: level4User.earnings.totalPackage,
                                                                totalIncome: level4User.earnings.totalIncome + Math.floor(Number(req.body.amount)*.01) ,
                                                                directIncome: level4User.earnings.directIncome,
                                                                levelIncome: level4User.earnings.levelIncome + Math.floor(Number(req.body.amount)*.01),
                                                                royalIncome: level4User.earnings.royalIncome,
                                                                teamAch: level4User.earnings.teamAch +Number(req.body.amount),
                                                                franchiseAch: level4User.earnings.franchiseAch,
                                                                availableBalance: level4User.earnings.availableBalance + Math.floor(Number(req.body.amount)*.01)
                                                              }}}, function(err){
                                                                if(err){
                                                                  console.log(err);
                                                                }else{
                                                                    //updating Transaction history for Level 1 User
                                                                    let level4Trnx = level4User.transaction;

                                                                    const newlevel4Trnx = {
                                                                        type: 'Credit',
                                                                        from: foundUser.username,
                                                                        amount: req.body.amount*0.01,
                                                                        status: 'Success',
                                                                        incomeType: 'Level',
                                                                        userID: foundUser.userID,
                                                                        time:{
                                                                          date: date,
                                                                          month: month,
                                                                          year: year
                                                                        },
                                                                        trnxId: trnxID
                                                                    }
                                                                    level4Trnx.push(newlevel4Trnx);
                                                                    User.updateOne({userID: level3User.sponsorID}, {$set:{transaction:level4Trnx}}, function(err){
                                                                      if(err){
                                                                        console.log(err);
                                                                      }
                                                                    });
                                                                  }
                                                              });
                                                            //User 4 Income updation Ends Here

                                                        }
                                                      }
                                                    });
                                                  }
                                                }
                                              });
                                            }
                                          }
                                        });
                                      }
                                    }
                                  });
                              }
                            }
                          });


                        }
                      });

                    }
                  }

                }
              })
            }
          });
        }
      });
  }
});

app.post("/franchiseAch", function(req, res){
  if(!req.session.admin){
    res.redirect('/adminLogin');
  }else{
    Admin.findOne({email:process.env.ADMIN}, function(err, foundAdmin){
      if(err){
        console.log(err);
      }else{
        if(!foundAdmin){
          res.redirect('/adminLogin');
        }else{
          User.findOne({email:req.body.email}, function(err, foundUser){
           if(err){
             console.log(err);
           }else{
             //Update User Franchise balance
                      User.updateOne({email: req.body.email},
                        {$set:
                          {earnings:
                            {
                            currentPackage: foundUser.earnings.currentPackage,
                            totalPackage: foundUser.earnings.totalPackage,
                            totalIncome: foundUser.earnings.totalIncome + Number(req.body.amount),
                            directIncome: foundUser.earnings.directIncome,
                            levelIncome: foundUser.earnings.levelIncome,
                            royalIncome: foundUser.earnings.royalIncome,
                            teamAch: foundUser.earnings.teamAch,
                            franchiseAch: foundUser.earnings.franchiseAch + Number(req.body.amount),
                            availableBalance: foundUser.earnings.availableBalance + Number(req.body.amount)
                            }}}, function(error){
                        if(error){
                          console.log(error);
                        }else{
                          //History and Transaction add up
                          const trnxID = "T" + String(Math.floor(Math.random()*999999999));
                          let history = foundUser.history;
                          let transaction = foundUser.transaction;
                          const newTransaction = {
                            type: 'Credit',
                            from: 'Club Earnings',
                            amount: req.body.amount,
                            status: 'Success',
                            time:{
                              date: date,
                              month: month,
                              year: year
                            },
                            trnxId: trnxID
                          }
                          transaction.push(newTransaction);

                          User.updateOne({email: req.body.email}, {$set:{transaction:transaction}}, function(error){
                            if(error){
                              console.log(error);
                            }
                          });
                        }
                      });
             res.redirect('/admin');
           }
          })
        }
      }
    })
  }
});




app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000 | http://localhost:3000");
});
