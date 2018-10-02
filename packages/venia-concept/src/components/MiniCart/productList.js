import React, { Component } from 'react';
import { arrayOf, number, shape, string, func } from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Product from './product';
import defaultClasses from './productList.css';

class ProductList extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        items: arrayOf(
            shape({
                item_id: number.isRequired,
                name: string.isRequired,
                price: number.isRequired,
                product_type: string,
                qty: number.isRequired,
                quote_id: string,
                sku: string.isRequired
            })
        ).isRequired,
        currencyCode: string.isRequired,
        removeItem: func
    };

    render() {
        const { currencyCode, removeItem, ...otherProps } = this.props;
        return (
            <List
                render="ul"
                getItemKey={item => item.item_id}
                renderItem={props => (
                    <Product
                        currencyCode={currencyCode}
                        removeItem={removeItem}
                        {...props}
                    />
                )}
                {...otherProps}
            />
        );
    }
}

export default classify(defaultClasses)(ProductList);
