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

// Function to decapitalize the name and capitalize only the first letter
function capitalize(name) {
  return String(name[0]).toUpperCase() + String(name).slice(1).toLowerCase();
}

const suForm = document.querySelector('.signup-form');

const password = suForm.querySelector('#su-password');

const strength = document.querySelector('.password-strength');
const allStrengths = strength.querySelectorAll('div');
const notStrong = strength.querySelector('.not-strong');
const kindaStrong = strength.querySelector('.kinda-strong');
const strong = strength.querySelector('.strong');
const veryStrong = strength.querySelector('.very-strong');

const hasNumber = /\d/;

password.addEventListener('input', () => {
  if (password.value.length === 0) {
    allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
    suForm.querySelector('.strength-message').textContent = 'Inget lösenord';
  }
  if (password.value.length < 6 && password.value.length > 0) {
    allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
    suForm.querySelector('.strength-message').textContent = 'Inte starkt';
    notStrong.style.backgroundColor = 'red';
  }
  if (password.value.length >= 6) {
    allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
    suForm.querySelector('.strength-message').textContent = 'Ganska starkt';
    notStrong.style.backgroundColor = 'orange';
    kindaStrong.style.backgroundColor = 'orange';
  }
  if (password.value.length >= 10) {
    allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
    suForm.querySelector('.strength-message').textContent = 'Starkt';
    notStrong.style.backgroundColor = 'yellow';
    kindaStrong.style.backgroundColor = 'yellow';
    strong.style.backgroundColor = 'yellow';
  }
  if (password.value.length > 10 && hasNumber.test(password.value)) {
    suForm.querySelector('.strength-message').textContent = 'Väldigt starkt';
    notStrong.style.backgroundColor = 'green';
    kindaStrong.style.backgroundColor = 'green';
    strong.style.backgroundColor = 'green';
    veryStrong.style.backgroundColor = 'green';
  }
});

let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

suForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let passed = true;

  suForm.querySelectorAll('p').forEach((p) => ((p.style.display = 'none'), (p.style.fontSize = '0.5em')));

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
    suForm.querySelector('.fName-error').style.display = '';
    passed = false;
  }
  // Last name input is emty
  if (lName.trim() === '') {
    suForm.querySelector('.lName-error').style.display = '';
    passed = false;
  }
  // Username input is empty or the user already exist
  if (un.trim() === '' || users.some((user) => user.username === un)) {
    suForm.querySelector('.username-error').style.display = '';
    passed = false;
  }
  // Mail input is empty, no "@", empty text before "@" or not correct "gmail.com"
  if (em.trim() === '' || splitMail === false || splitMail[0] === '' || splitMail[1].toLowerCase() !== 'gmail.com') {
    suForm.querySelector('.mail-error').style.display = '';
    passed = false;
  }
  // Password input is empty
  if (pw.value.trim() === '') {
    suForm.querySelector('.password-error').style.display = '';
    passed = false;
  }
  // Confirm password input doesn't match password input
  if (cpw.trim() !== pw.value.trim()) {
    suForm.querySelector('.c-password-error').style.display = '';
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
  }
  // input fields are not correctly filled
  else {
    return;
  }
  
  allStrengths.forEach((bar) => (bar.style.backgroundColor = '#a8a8a8'));
  suForm.querySelector('.strength-message').textContent = 'Inget lösenord';
  suForm.querySelectorAll('input').forEach((box) => (box.value = ''));
});
