import React, { Component, Suspense } from 'react';
import { array, func, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import classify from 'src/classify';
import defaultClasses from './cartOptions.css';
import Button from 'src/components/Button';
import Quantity from 'src/components/ProductQuantity';
import appendOptionsToPayload from 'src/util/appendOptionsToPayload';

const Options = React.lazy(() => import('../ProductOptions'));

class CartOptions extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            focusItem: string,
            price: string,
            form: string,
            quantity: string,
            quantityTitle: string,
            save: string,
            modal: string,
            modal_active: string,
            options: string
        }),
        cartItem: shape({
            item_id: number.isRequired,
            name: string.isRequired,
            price: number.isRequired,
            qty: number.isRequired
        }),
        configItem: shape({
            configurable_options: array
        }),
        updateCart: func.isRequired,
        hideEditPanel: func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            optionSelections: new Map(),
            quantity: props.cartItem.qty,
            isLoading: false
        };
    }

    get fallback() {
        return loadingIndicator;
    }

    setQuantity = quantity => this.setState({ quantity });

    handleSelectionChange = (optionId, selection) => {
        this.setState(({ optionSelections }) => ({
            optionSelections: new Map(optionSelections).set(
                optionId,
                Array.from(selection).pop()
            )
        }));
    };

    handleClick = async () => {
        const { updateCart, hideEditPanel, cartItem, configItem } = this.props;
        const { optionSelections, quantity } = this.state;
        const { configurable_options } = configItem;
        const isConfigurable = Array.isArray(configurable_options);
        const productType = isConfigurable
            ? 'ConfigurableProduct'
            : 'SimpleProduct';

        const payload = {
            item: configItem,
            productType,
            quantity: quantity
        };

        if (productType === 'ConfigurableProduct') {
            appendOptionsToPayload(payload, optionSelections);
        }
        this.setState({
            isLoading: true
        });
        await updateCart(payload, cartItem.item_id);
        this.setState({
            isLoading: false
        });
        hideEditPanel();
    };

    render() {
        const { fallback, handleSelectionChange, props, state } = this;
        const { classes, cartItem, configItem } = props;
        const { name, price } = cartItem;
        const { configurable_options } = configItem;

        const modalClass = state.isLoading
            ? classes.modal_active
            : classes.modal;

        const options = Array.isArray(configurable_options) ? (
            <Suspense fallback={fallback}>
                <section className={classes.options}>
                    <Options
                        options={configurable_options}
                        onSelectionChange={handleSelectionChange}
                    />
                </section>
            </Suspense>
        ) : null;

        return (
            <Form className={classes.root}>
                <div className={classes.focusItem}>
                    {name}
                    <div className={classes.price}>${price}</div>
                </div>
                <div className={classes.form}>
                    {options}
                    <section className={classes.quantity}>
                        <h2 className={classes.quantityTitle}>
                            <span>Quantity</span>
                        </h2>
                        <Quantity
                            initialValue={props.cartItem.qty}
                            onValueChange={this.setQuantity}
                        />
                    </section>
                </div>
                <div className={classes.save}>
                    <Button priority="high" onClick={this.props.hideEditPanel}>
                        <span>Cancel</span>
                    </Button>
                    <Button priority="high" onClick={this.handleClick}>
                        <span>Update Cart</span>
                    </Button>
                </div>
                <div className={modalClass}>
                    <span className={classes.modalText}>
                        {loadingIndicator}
                    </span>
                </div>
            </Form>
        );
    }
}

export default classify(defaultClasses)(CartOptions);
