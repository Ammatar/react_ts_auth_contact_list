const { User, Contact } = require('./index');

const seed = async () => {
  const admin = await User.create({
    username: 'admin',
    password: 'qwerty',
  });
  const user = await User.create({
    username: 'user',
    password: 'qwerty',
  });
  await Contact.create({
    name: 'random contact 1',
    phone: '+7999 999 99 99',
    UserId: 1,
  });
  await Contact.create({
    name: 'random contact 2',
    phone: '+7999 999 99 99',
    UserId: 1,
  });
  await Contact.create({
    name: 'random contact 3',
    phone: '+7999 999 99 99',
    UserId: 1,
  });
  await Contact.create({
    name: 'random contact 4',
    phone: '+7999 999 99 99',
    UserId: 2,
  });
  await Contact.create({
    name: 'random contact 5',
    phone: '+7999 999 99 99',
    UserId: 2,
  });
  await Contact.create({
    name: 'random contact 6',
    phone: '+7999 999 99 99',
    UserId: 2,
  });
};

module.exports = { seed };
