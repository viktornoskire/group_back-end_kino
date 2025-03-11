// __Events for the info modal___________________________________________________________
if (document.querySelector('.movie-headline') || document.querySelector('.about-page')) {
  const item0 = document.querySelector('.modal-item-0');
  const item1 = document.querySelector('.modal-item-1');
  const item2 = document.querySelector('.modal-item-2');

  function addListener(li) {
    const btn = li.querySelector('.modal-open');
    const answer = li.querySelector('.modal-answer');

    btn.addEventListener('click', () => {
      btn.classList.toggle('clicked');
      if (btn.className === 'modal-open clicked') {
        btn.src = './img/QnAClose.png';
        btn.alt = 'Close button';
        answer.style.display = '';
      } else {
        btn.src = './img/QnAOpen.png';
        btn.alt = 'Open button';
        answer.style.display = 'none';
      }
    });
  }

  addListener(item0);
  addListener(item1);
  addListener(item2);
}

// __Events for the header____________________________________
const r = document.querySelector('.hamburger-btn'),
  n = document.querySelector('.close-btn'),
  l = document.querySelector('.menu-overlay'),
  t = document.querySelector('.overlay-blur');
r.addEventListener('click', () => {
  (l.style.display = 'block'), t.classList.add('active');
});
n.addEventListener('click', () => {
  (l.style.display = 'none'), t.classList.remove('active');
});
t.addEventListener('click', () => {
  (l.style.display = 'none'), t.classList.remove('active');
});

// __Send review inputs to swagger API__________________________
if (document.querySelector('.movie-title')) {
  const reviewForm = document.querySelector('.review-box');
  const login = document.querySelector('.form-container');
  const overlay = document.querySelector('.blur');
  const submitLogin = document.querySelector('.login-submit');
  const comment = reviewForm.querySelector('.review-input');
  const rating = reviewForm.querySelector('.rating-input');
  const name = reviewForm.querySelector('.name-input');
  const errorText = reviewForm.querySelector('.error-message');
  const API_URL = 'https://plankton-app-xhkom.ondigitalocean.app/api/';

  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (comment.value == '' || name.value == '') {
      errorText.style.display = 'inline';
    } else {
      login.classList.add('active');
      overlay.classList.add('active');
      errorText.style.display = 'none';
    }
  });

  submitLogin.addEventListener('click', async () => {
    const username = document.querySelector("input[name='username']");
    const password = document.querySelector("input[name='password']");
    const credentials = `${username.value}:${password.value}`;
    const b64credentials = btoa(credentials);

    const loginRes = await fetch('/api/login', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + b64credentials,
      },
    });
    try {
      const loginPayload = await loginRes.json();
      const res = await fetch('/api/reviews', {
        headers: {
          Authorization: 'Bearer ' + loginPayload.token,
        },
      });
      const payload = await res.json();

      const movieID = window.location.pathname.split('/')[2];

      if (comment.value == '' || name.value == '') {
        error.style.display = 'inline';
      } else {
        try {
          fetch(API_URL + 'reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: {
                comment: comment.value,
                rating: rating.value,
                author: name.value,
                movie: movieID,
                verified: payload.ok,
              },
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log('Success:', data))
            .catch((error) => console.log('Error:', error));
          comment.value = '';
          rating.value = 0;
          name.value = '';
        } catch (err) {
          throw new Error('Error sending review', err);
        }
      }
    } catch (error) {
      errorText.innerText = 'Inkorrekt inloggning';
      errorText.style.display = 'inline';
    }

    username.value = '';
    password.value = '';
    login.classList.remove('active');
    overlay.classList.remove('active');
  });
}

// ____ Sign up _____

const signup = document.querySelector('#signup-modal');
const overlay = document.querySelector('.overlay-blur');

document.querySelector('#cancel-signup').addEventListener('click', () => {
  signup.classList.remove('flex');
  signup.classList.add('hidden');
  overlay.classList.remove('active');
  suForm.querySelectorAll('p').forEach((p) => (p.className = 'hidden'));
});

// Function to decapitalize the name and capitalize only the first letter
function capitalize(name) {
  return String(name[0]).toUpperCase() + String(name).slice(1).toLowerCase();
}

const suForm = document.querySelector('.signup-form');

const password = suForm.querySelector('#su-password');

const strength = document.querySelector('#password-strength');
const allStrengths = strength.querySelectorAll('div');
const notStrong = strength.querySelector('#not-strong');
const kindaStrong = strength.querySelector('#kinda-strong');
const strong = strength.querySelector('#strong');
const veryStrong = strength.querySelector('#very-strong');

const veryWeakPassword = /^(?=(.*[a-z])).{4,}$/;
const weakPassword = /^(?=(.*[a-z]){5,})(?=(.*[A-Z]){1,}).{6,}$/;
const strongPassword = /^(?=(.*[a-z]){4,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,}).{8,}$/;
const veryStrongPassword = /^(?=(.*[a-z]){5,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{10,}$/;

password.addEventListener('input', () => {
  if (password.value.length === 0) {
    allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
    suForm.querySelector('#strength-message').textContent = 'Inget lösenord';
  }
  if (veryWeakPassword.test(password.value)) {
    allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
    suForm.querySelector('#strength-message').textContent = 'Väldigt svagt';
    notStrong.style.backgroundColor = '#A72224';
  }
  if (weakPassword.test(password.value)) {
    allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
    suForm.querySelector('#strength-message').textContent = 'Svagt';
    notStrong.style.backgroundColor = '#FFCA28';
    kindaStrong.style.backgroundColor = '#FFCA28';
  }
  if (strongPassword.test(password.value)) {
    allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
    suForm.querySelector('#strength-message').textContent = 'Starkt';
    notStrong.style.backgroundColor = '#64DD17';
    kindaStrong.style.backgroundColor = '#64DD17';
    strong.style.backgroundColor = '#64DD17';
  }
  if (veryStrongPassword.test(password.value)) {
    suForm.querySelector('#strength-message').textContent = 'Väldigt starkt';
    notStrong.style.backgroundColor = '#154E10';
    kindaStrong.style.backgroundColor = '#154E10';
    strong.style.backgroundColor = '#154E10';
    veryStrong.style.backgroundColor = '#154E10';
  }
});

let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

suForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let passed = true;

  suForm.querySelectorAll('p').forEach((p) => (p.className = 'hidden'));

  // Names
  const fName = suForm.querySelector('#su-fname').value;
  const lName = suForm.querySelector('#su-lname').value;
  const un = suForm.querySelector('#su-username').value;

  // Mail
  const em = suForm.querySelector('#su-mail').value;
  const splitMail = em.includes('@') ? em.split('@') : false;

  // Passwords
  const pw = suForm.querySelector('#su-password');
  const cpw = suForm.querySelector('#su-c-password').value;

  // _______INPUT CONDITIONALS________
  // First name input is empty
  if (fName.trim() === '') {
    suForm.querySelector('#fName-error').className = 'block italic justify-self-end';
    passed = false;
  }
  // Last name input is emty
  if (lName.trim() === '') {
    suForm.querySelector('#lName-error').className = 'block italic justify-self-end';
    passed = false;
  }
  // Username input is empty or the user already exist
  if (un.trim() === '') {
    suForm.querySelector('#username-error').textContent = 'Ange användarnamn';
    suForm.querySelector('#username-error').className = 'block italic justify-self-end';
    passed = false;
  } else if (users.some((user) => user.username === un)) {
    suForm.querySelector('#username-error').textContent = 'Användarnamn upptaget';
    suForm.querySelector('#username-error').className = 'block italic justify-self-end';
    passed = false;
  }
  // Mail input is empty, no "@", empty text before "@" or not correct "gmail.com"
  if (em.trim() === '' || splitMail === false || splitMail[0] === '' || splitMail[1].toLowerCase() !== 'gmail.com') {
    suForm.querySelector('#mail-error').textContent = 'Ange korrekt E-postadress';
    suForm.querySelector('#mail-error').className = 'block italic justify-self-end';
    passed = false;
  } else if (users.some((user) => user.mail === em.toLowerCase())) {
    suForm.querySelector('#mail-error').textContent = 'E-postadress upptaget';
    suForm.querySelector('#mail-error').className = 'block italic justify-self-end';
    passed = false;
  }
  // Password input is empty
  if (pw.value.trim() === '') {
    suForm.querySelector('#password-error').className = 'block italic justify-self-end';
    passed = false;
  }
  // Confirm password input doesn't match password input
  if (cpw.trim() !== pw.value.trim()) {
    suForm.querySelector('#c-password-error').className = 'block italic justify-self-end';
    passed = false;
  }

  // all fields are filled correctly
  if (passed) {
    const user = {
      username: un,
      fName: capitalize(fName),
      lName: capitalize(lName),
      mail: em.toLowerCase(),
      password: pw.value,
    };
    users.push(user);

    localStorage.setItem('users', JSON.stringify(users));

    signup.classList.remove('flex');
    signup.classList.add('hidden');

    const suConf = document.querySelector('#signup-confirm');
    suConf.classList.remove('hidden');
    suConf.classList.add('flex');

    const thanks = suConf.querySelector('#thankyou-message').textContent;
    suConf.querySelector('#thankyou-message').textContent = thanks + ' ' + capitalize(fName) + "!";

    const gotoLogin = suConf.querySelector('#goto-login');
    gotoLogin.addEventListener('click', () => {
      suConf.classList.remove('flex');
      suConf.classList.add('hidden');
      suConf.querySelector('#thankyou-message').textContent = 'Tack för att du har skapat ett konto hos oss';

      login.classList.remove('hidden');
      login.classList.add('flex');
    });
  }
  // input fields are not correctly filled
  else {
    return;
  }

  allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
  document.querySelectorAll('input').forEach((box) => (box.value = ''));
});

// ____ LOGIN _____

const login = document.querySelector('#login');
const registerBtn = document.querySelector('#register-btn');

registerBtn.addEventListener('click', () => {
  login.classList.remove('flex');
  login.classList.add('hidden');

  signup.classList.remove('hidden');
  signup.classList.add('flex');
});

document.querySelector('#loginButton').addEventListener('click', () => {
  login.classList.remove('hidden');
  login.classList.add('flex');
  overlay.classList.add('active');
});

document.querySelector('#cancel-btn').addEventListener('click', () => {
  login.classList.remove('flex');
  login.classList.add('hidden');
  overlay.classList.remove('active');
});

const liForm = document.querySelector('#login-form');

liForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const liError = liForm.querySelector('#error-message');
  const liMail = liForm.querySelector('#email').value.toLowerCase().trim();
  const liPass = liForm.querySelector('#password').value.trim();

  const correctPass = (user) => user.password === liPass;
  const correctMail = (user) => user.mail === liMail;

  const indexOfCorrectPass = users.some((user) => user.password === liPass) ? users.findIndex(correctPass) : false;
  const indexOfCorrectMail = users.some((user) => user.mail === liMail) ? users.findIndex(correctMail) : false;

  if (!users.some((user) => user.mail === liMail)) {
    liError.textContent = 'Lösenord eller E-postadress fel';
    liError.classList.remove('hidden');
    liError.classList.add('block');
    return;
  }
  if (indexOfCorrectMail === false || indexOfCorrectPass === false) {
    liError.textContent = 'Lösenord eller E-postadress fel';
    liError.classList.remove('hidden');
    liError.classList.add('block');
    return;
  }
  if (indexOfCorrectMail !== indexOfCorrectPass) {
    liError.textContent = 'Lösenord eller E-postadress fel';
    liError.classList.remove('hidden');
    liError.classList.add('block');
    return;
  }

  liForm.querySelector('#email').value = '';
  liForm.querySelector('#password').value = '';
  liError.textContent = '';

  login.classList.remove('flex');
  login.classList.add('hidden');
  
  const liConf = document.querySelector("#login-confirm");
  liConf.classList.remove("hidden");
  liConf.classList.add("flex");

  liConf.querySelector("#close").addEventListener("click", () => {
    liConf.classList.remove('flex');
    liConf.classList.add('hidden');
    overlay.classList.remove("active");
  });
});
