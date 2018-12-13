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

    state = {
        message: null
    };


    componentDidMount() {
        const newMessage = this.getMessage();
        this.setState({
            message: newMessage
        });
    }

    componentDidUpdate(prevProps) {
        const { loadMessage } = this.props;
        if (this.props !== prevProps) {
            const newMessage = this.getMessage();
            this.setState({
                message: newMessage
            });
            if ((this.state.message === messages.get('loading')) && loadMessage !== null) {
                this.setState({
                    message: React.cloneElement(this.state.message, {text: loadMessage})
                });
            }
        }
    }

    getMessage() {
        const { loading, notFound } = this.props;
        const newMessage = loading
            ? messages.get('loading')
            : notFound 
            ? messages.get('notFound')
            : messages.get('internalError');
        return newMessage;
    }

    render() {
        const { classes } = this.props;

        return <article className={classes.root}> {this.state.message} </article>;
    }
}

export default classify(defaultClasses)(ErrorView);
