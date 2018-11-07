import React, { Component } from 'react';
import logo from 'src/components/Header/logo.svg';
import defaultClasses from './notFound.css';
import classify from 'src/classify';
import { string, shape } from 'prop-types';

class NotFound extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            title: string,
            logo: string,
            message: string,
            actions: string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <h1 className={classes.title}>
                    <div>
                        4
                        <img
                            className={classes.logo}
                            src={logo}
                            alt="Venia"
                            title="Venia"
                        />
                        4
                    </div>
                    <div>Page Not Found</div>
                </h1>
                <div className={classes.message}>
                    <p>
                        <span>
                            Sorry, we could not find the page you were trying to
                            get to. Try
                        </span>
                        <a href="/" className={classes.actions}>
                            {' '}
                            going to the home page{' '}
                        </a>
                        <span> to get back on track.</span>
                    </p>
                </div>
                <div className="NotFound-content-actions" />
            </div>
        );
    }
}

export default classify(defaultClasses)(NotFound);
