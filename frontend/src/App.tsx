import React from 'react';
import './App.css';
import { observer } from 'mobx-react-lite';
import { store } from './store';
import Contact from './components/Contact';

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

  const [name, setName] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');

  const [filter, setFilter] = React.useState('');
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
  }, [store.contacts]);
  return (
    <div className='app__container'>
      <nav>
        Contact book
        {logged ? <> for {store.getUser()}</> : null}
        {logged ? (
          <div className='nav__controls'>
            <button onClick={() => setNewForm(true)}>create new</button>
            {logged && newForm ? (
              <div className='newContact__form'>
                <input
                  placeholder='name'
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <input
                  placeholder='phone'
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    store.createNewContact(name, phone);
                    setName('');
                    setPhone('');
                    setNewForm(false);
                  }}
                >
                  apply
                </button>
                <button
                  onClick={() => {
                    setName('');
                    setPhone('');
                    setNewForm(false);
                  }}
                >
                  chancel
                </button>
              </div>
            ) : null}
            <button onClick={async () => setLogged(await store.logout())}>
              Logout
            </button>
          </div>
        ) : (
          <div>
            <input
              placeholder='Your login > 3 chars'
              value={login}
              onChange={(e) => {
                setLogin(e.target.value);
              }}
            />
            <input
              placeholder='Your pass > 3 chars'
              type='password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              onClick={async () => {
                setLogged(await store.login(login, password));
                setLogin('');
                setPassword('');
              }}
            >
              Login
            </button>
            {/* {' or '} */}
            <button
              onClick={() => {
                store.register(login, password);
              }}
              disabled={login.length < 3 || password.length < 3 ? true : false}
            >
              Register
            </button>
          </div>
        )}
      </nav>
      <main>
        <div>
          {logged ? (
            <input
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
