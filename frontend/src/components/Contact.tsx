import * as React from 'react';
import { store } from '../store';

import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

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
        <Input
          type='text'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          disabled={!editMode}
          sx={{
            input: {
              '&:disabled': {
                color: 'black',
                opacity: 'unset',
                WebkitTextFillColor: 'unset',
              },
            },
          }}
        />
        <Input
          type='text'
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
          disabled={!editMode}
          sx={{
            input: {
              '&:disabled': {
                color: 'black',
                opacity: 'unset',
                WebkitTextFillColor: 'unset',
              },
            },
          }}
        />
      </div>
      <div className='contact_list__controls'>
        {editMode ? (
          <>
            <Button
              size='small'
              variant='outlined'
              onClick={() => {
                store.editContact(el.id, name, phone);
                setEditMode(false);
              }}
            >
              save
            </Button>
            <Button
              size='small'
              variant='outlined'
              onClick={() => setEditMode(false)}
            >
              cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditMode(true)}>edit</Button>
        )}
        <Button onClick={() => store.deleteContact(el.id)}>delete</Button>
      </div>
    </div>
  );
}
