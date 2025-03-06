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

const suForm = document.querySelector('.signup-form');
const liForm = document.querySelector('.login-form');

let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

suForm.addEventListener('submit', (e) => {
  e.preventDefault();
  liForm.querySelector('.wrongC').style.display = 'none';
  liForm.querySelector('.correctC').style.display = 'none';

  const un = suForm.querySelector('#su-username').value;
  const pw = suForm.querySelector('#su-password').value;

  const user = { username: un, password: pw };
  users.push(user);

  localStorage.setItem('users', JSON.stringify(users));

  suForm.querySelector('#su-username').value = '';
  suForm.querySelector('#su-password').value = '';
});

users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];

liForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const un = liForm.querySelector('#li-username').value;
  const pw = liForm.querySelector('#li-password').value;

  if (users.some((user) => user.username === un)) {
    console.log('True');
    liForm.querySelector('.wrongC').style.display = 'none';
    liForm.querySelector('.correctC').style.display = '';
  } else {
    console.log('False');
    liForm.querySelector('.wrongC').style.display = '';
    liForm.querySelector('.correctC').style.display = 'none';
  }

  liForm.querySelector('#li-username').value = '';
  liForm.querySelector('#li-password').value = '';
});
