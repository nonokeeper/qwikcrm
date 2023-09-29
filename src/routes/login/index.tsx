import {$, component$, useSignal } from "@builder.io/qwik";
import { Form, useNavigate } from "@builder.io/qwik-city";
import Header from "~/components/header";
const baseURL = import.meta.env.VITE_BASEURL;

// Interfaces
interface userInterface {
    "_id": string,
    "firstName"?: string,
    "lastName"?: string,
    "username": string,
    "email": string,
    "group"?: string,
    "roles"?: object,
    "accessToken"?: string,
    "refreshToken"?: string,
    "errorMessage"?: string
  }

export default component$(() => {
    console.log('Login Page');

    const username = useSignal('');
    const password = useSignal('');
    const userLoggedIn = useSignal(false);
    const loginForm = useSignal<HTMLFormElement>();
    const nav = useNavigate();
/*
    const logout = $(() => {
        localStorage.removeItem('user');
      });
*/
    const login = $(async() => {
        console.log('login > async login() DEBUT');
        const res = await fetch(baseURL+"login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            username: username.value,
            password: password.value
            }),
        });
        console.log('login > async login() après Fetch');
        const user:userInterface = await res.json();
        if (res.status == 200) {
            console.log('index.tsx > user : ', user)
            loginForm.value?.reset();
            userLoggedIn.value = true;
        } else {
            console.log('login index.tsx => Error : ', res.status, ' / ', res.statusText)
        }
        localStorage.setItem('user', JSON.stringify(user));
        nav('/');
    });

    return(
        <>
        <Header userConnected={false} /><p>Login Page</p>
        <div class="mx-10">
            <Form preventdefault:submit ref={loginForm}>
                <input placeholder="Username" class="border-2 border-cyan-900 mx-2" type="text" bind:value={username}/>
                <input placeholder="Password" class="border-2 border-cyan-900 mx-2" type="password" bind:value={password}/>
                <button class="bg-orange-500 text-white rounded-lg px-2 py-2" onClick$={login}>Enter</button>
            </Form>
        </div>
        </>
    )
});