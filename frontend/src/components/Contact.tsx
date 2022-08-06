import * as React from 'react';
import { store } from '../store';
export interface IContactProps {
  el: {
    id: number;
    name: string;
    phone: string;
  };
}

export default function Contact({ el }: IContactProps) {
  const [name, setName] = React.useState(el.name);
  const [phone, setPhone] = React.useState(el.phone);

  const [editMode, setEditMode] = React.useState(false);

  return (
    <div className='contact_list__item'>
      <div>
        {editMode ? (
          <>
            <input
              type='text'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type='text'
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </>
        ) : (
          <>
            {el.name} - {el.phone}
          </>
        )}
      </div>
      <div className='contact_list__controls'>
        {editMode ? (
          <>
            <button
              onClick={() => {
                store.editContact(el.id, name, phone);
                setEditMode(false);
              }}
            >
              save
            </button>
            <button onClick={() => setEditMode(false)}>cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>edit</button>
        )}
        <button onClick={() => store.deleteContact(el.id)}>delete</button>
      </div>
    </div>
  );
}
