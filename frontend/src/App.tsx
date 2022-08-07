import React from 'react';
import './App.css';
import { observer } from 'mobx-react-lite';
import { store } from './store';
import Contact from './components/Contact';

import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

const App = observer(() => {
  const [contacts, setContacts] = React.useState<
    | [
        {
          id: number;
          name: string;
          phone: string;
          UserId: number;
        }
      ]
    | []
  >(store.getContactState());

  const [logged, setLogged] = React.useState<boolean>(false);

  const [newForm, setNewForm] = React.useState<boolean>(false);

  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const [error, setError] = React.useState<string>('');

  const [name, setName] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');

  const [filter, setFilter] = React.useState('');

  function submitLogin(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    console.log(event.target);
  }
  React.useEffect(() => {
    store.getAllContacts();
    setLogged(store.token ? true : false);
  }, []);
  React.useEffect(() => {
    if (logged) {
      store.getAllContacts();
    }
  }, [logged]);
  React.useEffect(() => {
    setContacts(store.getContactState());
    // eslint-disable-next-line
  }, [store.contacts]);
  return (
    <div className='app__container'>
      <nav>
        Contact book
        {logged ? <> for {store.getUser()}</> : null}
        {logged ? (
          <div className='nav__controls'>
            <Button
              variant='outlined'
              size='small'
              onClick={() => setNewForm(true)}
            >
              new
            </Button>
            <Button
              variant='outlined'
              size='small'
              onClick={async () => setLogged(await store.logout())}
            >
              Logout
            </Button>
            {logged && newForm ? (
              <div className='newContact__form'>
                <Input
                  placeholder='name'
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <Input
                  placeholder='phone'
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
                <Button
                  onClick={() => {
                    store.createNewContact(name, phone);
                    setName('');
                    setPhone('');
                    setNewForm(false);
                  }}
                >
                  apply
                </Button>
                <Button
                  onClick={() => {
                    setName('');
                    setPhone('');
                    setNewForm(false);
                  }}
                >
                  cancel
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            {error ? <div className='error__box'>{error}</div> : null}
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className='input__box'>
                <Input
                  placeholder='Your login > 3 chars'
                  value={login}
                  onChange={(e) => {
                    setLogin(e.target.value);
                  }}
                  className={error ? 'error' : ''}
                />
                <Input
                  placeholder='Your pass > 3 chars'
                  type='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className={error ? 'error' : ''}
                />
              </div>
              <Button
                variant='outlined'
                size='small'
                className='control_button'
                type='submit'
                onClick={async () => {
                  const result = await store.login(login, password);
                  // console.log(result);

                  setLogged(result);
                  if (result) {
                    setLogin('');
                    setPassword('');
                    setError('');
                  } else {
                    setError('Wrong credentials provided');
                  }
                }}
              >
                Login
              </Button>
              {/* {' or '} */}
              <Button
                variant='outlined'
                size='small'
                onClick={() => {
                  store.register(login, password);
                }}
                disabled={
                  login.length < 3 || password.length < 3 ? true : false
                }
              >
                Register
              </Button>
            </form>
          </div>
        )}
      </nav>
      <main>
        <div className='filter__box'>
          {logged ? (
            <Input
              type='text'
              placeholder='Filter'
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          ) : null}
        </div>
        {contacts && logged
          ? contacts
              .filter((el) => {
                return el.name.toLowerCase().includes(filter.toLowerCase());
              })
              .map((el) => {
                return <Contact el={el} key={el.name + el.phone + el.id} />;
              })
          : null}
      </main>
      <footer>Footer</footer>
    </div>
  );
});

export default React.memo(App);
