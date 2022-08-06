import { makeAutoObservable } from 'mobx';
let host = process.env.MODE === 'production' ? '' : `http://localhost:3010`;

interface IContact {
  id: number;
  name: string;
  phone: string;
  UserId: number;
}

class Store {
  contacts: [IContact] | [] = [];
  token: string | null = '';
  constructor() {
    makeAutoObservable(this);
    this.tokenRecover();
  }
  getUser() {
    if (this.token) {
      const user = this.token?.split('_')[1];
      return user;
    } else {
      return 'token missing';
    }
  }
  getContactState() {
    return this.contacts;
  }
  resetContacts() {
    this.contacts = [];
  }
  async register(login: string, password: string) {
    //
    await fetch(host + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: login,
        password,
      }),
    });
  }
  async login(username: string, password: string) {
    //
    const res = await fetch(host + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const { token } = await res.json();
    this.getAllContacts();
    localStorage.setItem('token', token);
    this.tokenRecover();
    return true;
  }
  async logout() {
    this.resetContacts();
    localStorage.removeItem('token');
    return false;
  }
  tokenRecover() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }
  }
  updateContacts(payload: [IContact] | []) {
    this.contacts = payload;
  }
  async getAllContacts() {
    // console.log('data requsted');
    if (localStorage.getItem('token')) {
      // const token = localStorage.getItem('token') || '';
      const res = await fetch(host + '/contacts/all', {
        method: 'GET',
        headers: {
          token: this.token ? this.token : '',
        },
      });
      this.updateContacts(await res.json());
    }
  }
  async createNewContact(name: string, phone: string) {
    await fetch(host + '/contact/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: this.token ? this.token : '',
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
      }),
    });

    await this.getAllContacts();
  }
  async editContact(id: number, name: string, phone: string) {
    await fetch(host + `/contact/edit/?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: this.token ? this.token : '',
      },
      body: JSON.stringify({
        newName: name,
        newPhone: phone,
      }),
    });
    await this.getAllContacts();
  }
  async deleteContact(id: number) {
    await fetch(host + `/contact/delete/?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: this.token ? this.token : '',
      },
    });
    await this.getAllContacts();
  }
}

export const store = new Store();
