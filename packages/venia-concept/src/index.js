import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { persistCache } from 'apollo-cache-persist';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Provider as ReduxProvider } from 'react-redux';
import { Router, Util } from '@magento/peregrine';

import store from 'src/store';
// import { getUserDetails } from 'src/actions/user';
import app from 'src/actions/app';
import AppShell from 'src/components/AppShell';
import ensureDirURI from 'src/util/ensureDirUri';
import './index.css';


// store.dispatch(getUserDetails());

const { BrowserPersistence } = Util;
const __tmp_webpack_public_path__ = ensureDirURI(__webpack_public_path__);
const apiBase = new URL('/graphql', location.origin).toString();

const runtimeConfig = { __tmp_webpack_public_path__, apiBase };
const httpLink = createHttpLink({
    __tmp_webpack_public_path__,
    uri: apiBase
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const storage = new BrowserPersistence();
    // TODO: Get correct token expire time from API
    const token = storage.getItem('signin_token');

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

const cache = new InMemoryCache();

persistCache({
    cache,
    storage: window.localStorage
});

const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache
});

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <ReduxProvider store={store}>
            <Router config={runtimeConfig}>
                <AppShell />
            </Router>
        </ReduxProvider>
    </ApolloProvider>,
    document.getElementById('root')
);

if (process.env.SERVICE_WORKER && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(process.env.SERVICE_WORKER)
            .then(registration => {
                console.log('Service worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service worker registration failed: ', error);
            });
    });
}

window.addEventListener('online',  () => {store.dispatch(app.setOnline())});
window.addEventListener('offline', () => {store.dispatch(app.setOffline())});
