import jsonwebtoken from 'jsonwebtoken';

const LOGIN = [
  {
    username: 'viktor',
    password: 'wilma',
  },
  {
    username: 'rikard',
    password: 'rikard3209',
  },
  {
    username: 'johnny',
    password: 'zidust',
  },
  {
    username: 'johannes',
    password: 'spinalglitter38',
  },
  {
    username: 'louise',
    password: 'lillamylouise',
  },
  {
    username: 'emily',
    password: 'emily_92251',
  },
  {
    username: 'oscar',
    password: 'oscar0709',
  },
];

const SECRET = 'averylongpasswordthattheonlyonewhoknowswhatitisisthiscomputercodeblock';

export const reviewAdapter = {
  sendReviewAccess: (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.slice(7);

    try {
      const payload = jsonwebtoken.verify(token, SECRET);
      res.status(200).json({
        ok: true,
      });
    } catch (error) {
      res.status(401).json({
        ok: false,
        error: 'not allowed',
      });
    }
  },
  loadLogin: (req, res) => {
    const authHeader = req.headers.authorization;
    const b64credentials = authHeader.slice(6);
    const credentials = atob(b64credentials);
    const fields = credentials.split(':');
    const username = fields[0];
    const password = fields[1];

    if (
      (username == LOGIN[0].username && password == LOGIN[0].password) ||
      (username == LOGIN[1].username && password == LOGIN[1].password) ||
      (username == LOGIN[2].username && password == LOGIN[2].password) ||
      (username == LOGIN[3].username && password == LOGIN[3].password) ||
      (username == LOGIN[4].username && password == LOGIN[4].password) ||
      (username == LOGIN[5].username && password == LOGIN[5].password) ||
      (username == LOGIN[6].username && password == LOGIN[6].password)
    ) {
      const jwt = jsonwebtoken.sign(
        {
          username: username,
          role: 'reviewer',
        },
        SECRET
      );
      res.status(200).json({
        ok: true,
        token: jwt,
      });
    } else {
      res.status(401).end();
    }
  },
};
