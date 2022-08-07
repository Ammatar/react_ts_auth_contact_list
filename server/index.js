const express = require('express');
const cors = require('cors');
const PORT = 3010;
const path = require('path');

//
const { User, Contact, sequelize } = require('./db');
const { seed } = require('./db/someBasicSeed');
//

const app = express();
// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

if (path.join(__dirname, '..', 'frontend/build/index.html')) {
  app.use('/', express.static(path.join(__dirname, '..', 'frontend/build')));
}
const protected = (req, res, next) => {
  console.log('middleware called!!!');
  if (req.headers['token']) {
    console.log('token provided: ', req.headers['token']);
    next();
  } else {
    res.status(401).json();
  }
};
//
// db connection and some mock seed
//
(async () => {
  await sequelize.sync();
  if ((await User.findAll()).length === 0) {
    await seed();
  }
})();
// app serving service
app.get('/', async (req, res) => {
  console.log(path.join(__dirname, '..', 'frontend/build/index.html'));
  const html = path.join(__dirname, '..', 'frontend/build/index.html');
  res.status(200).sendFile(html);
});
//
// auth service
//
app.post('/auth/register', async (req, res) => {
  // register
  console.log(req.body);
  const ifUser = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (ifUser) {
    res.status(200).json();
  } else {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    res.status(200).json();
  }
});
app.post('/auth/login', async (req, res) => {
  // login
  const user = await User.findOne({
    where: {
      username: req.body.username,
      password: req.body.password,
    },
  });

  if (user) {
    res
      .status(200)
      .json({ token: `${user.password}_${user.username}_${Date.now()}` });
  } else {
    res.status(200).json({ token: '' });
  }
});
//
// contact list service
//
app.post('/contact/create', protected, async (req, res) => {
  // create contact
  console.log(req.body, req.headers['token']);
  const user = await User.findOne({
    where: {
      username: req.headers['token'].split('_')[1],
    },
  });
  console.log(user.id);
  const contact = await Contact.create({
    name: req.body.name,
    phone: req.body.phone,
    UserId: user.id,
  });
  res.status(200).json();
});
app.get('/contacts/all', protected, async (req, res) => {
  let id;
  if (req.headers['token']) {
    id = req.headers['token'].split('_');
  }
  console.log(req.headers['token']);
  const user = await User.findOne({
    where: {
      username: id[1],
    },
    attributes: ['id', 'username', 'password'],
  });
  const contacts = await Contact.findAll({
    where: {
      UserId: user.id,
    },
    attributes: ['id', 'name', 'phone', 'UserId'],
  });
  res.status(200).json(contacts);
});
app.post('/contact/edit', protected, async (req, res) => {
  // edit contact
  //   console.log(req.body, req.query.id);
  if (req.query.id) {
    const contact = await Contact.findOne({
      where: {
        id: req.query.id,
      },
    });
    contact.name = req.body.newName;
    contact.phone = req.body.newPhone;
    contact.save();
  }
  res.status(200).json();
});
app.delete('/contact/delete', protected, async (req, res) => {
  // delete contact
  //   console.log('to delete:', req.query.id);
  if (req.query.id) {
    await Contact.destroy({
      where: {
        id: req.query.id,
      },
    });
  }
  res.status(200).json();
});
app.listen(PORT, () => {
  console.log('express server started at ' + PORT);
});
