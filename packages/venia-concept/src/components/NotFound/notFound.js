import React, { Component } from 'react';
import logo from 'src/components/Header/logo.svg';
import defaultClasses from './notFound.css';
import classify from 'src/classify';
import Button from 'src/components/Button';
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
                    <div className={classes.text}>
                        Sorry! We could not find the page you requested.
                    </div>
                    <a href="/">
                        <Button>
                            Continue Shopping
                        </Button>
                    </a>
                </div>
                <div className="NotFound-content-actions" />
            </div>
        );
    }
}

export default classify(defaultClasses)(NotFound);
