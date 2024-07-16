'use strict';

// BANKIST APP
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDate:['2024-07-18T21:30:17.178Z','2019-11-18T21:31:17.178Z','2019-12-18T21:01:17.178Z','2019-11-18T21:01:17.178Z','2019-10-18T21:01:17.178Z','2019-09-18T21:01:17.178Z','2019-07-18T21:01:17.178Z','2019-06-18T21:01:17.178Z'
  ],
  currency:'EUR',
  locale:'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDate:['2019-10-18T21:30:17.178Z','2019-11-18T21:31:17.178Z','2019-12-18T21:01:17.178Z'
  ],
  currency:'EUR',
  locale:'pt-PT',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDate:['2019-10-18T21:30:17.178Z','2019-11-18T21:31:17.178Z','2019-12-18T21:01:17.178Z'
  ],
  currency:'EUR',
  locale:'pt-PT',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDate:['2019-10-18T21:30:17.178Z','2019-11-18T21:31:17.178Z','2019-12-18T21:01:17.178Z'
  ],
  currency:'EUR',
  locale:'pt-PT',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//function
const formatMovementsDate = function (date) {
  const calcDaysPassed = (date1 , date2) => Math.round(Math.abs(date2-date1)/(1000*60*60*24));
  const dayPassed = calcDaysPassed(new Date(),date);

  if(dayPassed ===0) return 'today';
  if(dayPassed ===1) return 'yesterday';
  if(dayPassed <= 7) return `${dayPassed}days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()+1}`.padStart(2, 0);
    const year = date.getFullYear();
    const hour = `${date.getHours()}`.padStart(2, 0);
    const min = `${date.getMinutes()}`.padStart(2, 0);
    return `${day}/${month}/${year}, ${hour}:${min}`;
  }
}
const formatCur = function(value,locale,currency) {
  return new Intl.NumberFormat(locale, {
    style:'currency',
    currency:currency,
  }).format(value);
}


//diplay movements balance
const displayMovement = function(acc, sort =false) {
  containerMovements.innerHTML = '';
  //.textContent - 0;
  const movs = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;
  movs.forEach(function (mov,i) {
  const type = mov > 0 ? 'deposit' : 'withdrawal';

  const date = new Date(acc.movementsDate[i]);
  const displayDate = formatMovementsDate(date);
  const formattedMov = formatCur(mov,acc.locale,acc.currency);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin',html)
    });
    }
    // displayMovement(account1.movements)

  //display balance
  const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc,mov) => acc + mov,0);
    labelBalance.textContent = formatCur(acc.balance,acc.locale,acc.currency);
  };
  // calcDisplayBalance(account1.movements);

//display summary on bottom of page
const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
  //filter acc.movements
  .filter(mov => mov >0)
  //acc all data
  .reduce((acc,mov) => acc + mov,0);
  labelSumIn.textContent = formatCur(incomes,acc.locale,acc.currency);
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`

  const outcomes = acc.movements
  .filter(mov => mov <0)
  .reduce((acc,mov) => acc + mov,0);
  labelSumOut.textContent = formatCur(Math.abs(outcomes),acc.locale,acc.currency);
  // labelSumOut.textContent = `${Math.abs(outcomes)}€`

  const interest = acc.movements
  .filter(mov => mov >0)
  .map(deposit => deposit*acc.interestRate/100)
  //filter movements over 1 ignore float 0.
  .filter((int,i) => int>=1)
  .reduce((acc,int) => acc + int,0);
  labelSumInterest.textContent = formatCur(interest,acc.locale,acc.currency);
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`
}
// calcDisplaySummary(account1.movements);

  //create username on each account
  const createUsername = function (accs) {
    accs.forEach(function(acc) {
      acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
    });
    };
    createUsername(accounts);

    //update ui
    const updateUI = function(acc){
      // //display movements
      displayMovement(acc);

      //display balance 
      calcDisplayBalance(acc);

      //display summary
      calcDisplaySummary(acc);
      }

    const startLogOutTimer = function() {
      const tick = function() {
        const min = String(Math.trunc(time /60)).padStart(2.0);
        const sec = String(Math.trunc(time % 60)).padStart(2.0);
        labelTimer.textContent = `${min}:${sec}`;
        if(time=== 0) {
          clearInterval(timer);
          labelWelcome.textContent = 'Log in to get start';
          containerApp.style.opacity = 0;
        }
        time--; 
      }
      let time =300;
      tick();
      const timer = setInterval(tick, 1000);
      return timer;
    }
    //event handler
  let currentAccount,timer;
  
  btnLogin.addEventListener('click',function(e) {
    //prevent form from submitting
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    if(currentAccount?.pin === Number(inputLoginPin.value)) {
      //display UI and welcome message
      labelWelcome.textContent = `Welcome back , ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity = 100;

      //create current date
      function time() {
      const now = new Date();
      const day = `${now.getDate()}`.padStart(2, 0);
      const month = `${now.getMonth()+1}`.padStart(2, 0);
      const year = now.getFullYear();
      const hour = `${now.getHours()}`.padStart(2, 0);
      const min = `${now.getMinutes()}`.padStart(2, 0);
      const sec = `${now.getSeconds()}`.padStart(2, 0);
      labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}:${sec}`;    
      }
      setInterval(time,1000);
      

      //clear input field
      inputLoginUsername.value = inputLoginPin.value = '';
      //clear focus input
      inputLoginPin.blur();

      //timer 
      if(timer) clearInterval(timer);
      timer = startLogOutTimer();

      //update UI
      updateUI(currentAccount);
    }
  });

  //transfer to another account
  btnTransfer.addEventListener('click',function(e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);
    inputTransferAmount.value=inputTransferTo.value='';
    //check requirement, amount >0 , balance > amount , there is receiver account and check receiver not the
    if(amount > 0 && 
      currentAccount.balance >= amount &&
      receiverAcc &&
      receiverAcc.username !== currentAccount.username
     ){
      //transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      
      //add transfer date
      currentAccount.movementsDate.push(new Date().toISOString());
      receiverAcc.movementsDate.push(new Date().toISOString());


      //update UI
      updateUI(currentAccount);

      //reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
     }
  });

  btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    if (amount > 0 && currentAccount.movements.some(move =>move >= amount *0.1)) {
      setTimeout(function() {
      //add movements
      currentAccount.movements.push(amount);
      //add loan date
      currentAccount.movementsDate.push(new Date().toISOString());
      //update UI
      updateUI(currentAccount);
      //clear timer
      clearInterval(timer);
      timer = startLogOutTimer();
    },2500);
    }
    inputLoanAmount.value = '';
  })

  //close account
  btnClose.addEventListener('click', function(e) {
    e.preventDefault();
    if(inputCloseUsername.value === currentAccount.username 
      && Number(inputClosePin.value) === currentAccount.pin) {
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      //delete account
      accounts.splice(index, 1);
      //hide UI
      containerApp.style.opacity = 0;
    };
    inputCloseUsername.value = inputClosePin.value = '';
  });

  //sorting movements
  let sorted = false;
  btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;

  })

  const overallBalance = accounts
  // .map(acc => acc.movements)
  // .flat()
  .flatMap(acc => acc.movements)
  .reduce((acc,mov) => acc + mov,0);
  // console.log(overallBalance);
