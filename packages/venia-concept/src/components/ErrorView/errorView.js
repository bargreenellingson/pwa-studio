import React, { Component } from 'react';
import classify from 'src/classify';
import defaultClasses from './errorView.css';
import Loader from 'src/components/Loader';
import NotFound from 'src/components/NotFound';


const messages = new Map()
    .set('loading', <Loader />)
    .set('notFound', <NotFound />)
    .set('internalError', <h1>500 Internal Server Error</h1>);

class ErrorView extends Component {
    render() {
        const { classes, loading, notFound } = this.props;
        const message = loading
            ? messages.get('loading')
            : notFound
                ? messages.get('notFound')
                : messages.get('internalError');

      return <article className={classes.root}> {message} </article>;
    }
}

export default classify(defaultClasses)(ErrorView);
