import React, { Component } from 'react';
import { string, func, object, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './productEdit.css';
import ProductOptions from 'src/components/ProductOptions';
import OptionsHeader from 'src/components/ProductOptions/optionsHeader';
import { mockColor } from './mockColor';

class ProductEdit extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            colors: string,
            header: string
        }),
        item: object.isRequired,
        onOptionChange: func.isRequired
    };

    mapOptions = configurableOptions => {
        const productOptions = configurableOptions.map(option => {
            const options = option.values.map(value => {
                return {
                    item: {
                        // TODO: remove mockColor once swatch_color is
                        // implemented in graphql
                        backgroundColor: mockColor[value.label],
                        label: value.label,
                        value_index: value.value_index,
                        attributeCode: option.attribute_code,
                        isDisabled: value.isDisabled
                    },
                    children: value.label,
                    attributeCode: option.attribute_code
                };
            });
            return {
                attributeCode: option.attribute_code,
                options: options,
                position: option.position,
                label: option.label
            };
        });
        return productOptions;
    };

    optionsComponent = (productOption, index) => {
        const props = {
            key: index,
            title: productOption.label,
            helpClick: () => {
                window.alert('Testing');
            },
            attributeCode: productOption.attributeCode
        };
        if (productOption.attributeCode === 'size') {
            props.helpText = 'Size Guide';
        }
        return (
            <OptionsHeader {...props}>
                <ProductOptions
                    onSelect={this.props.onOptionChange}
                    options={productOption.options}
                />
            </OptionsHeader>
        );
    };

    onProductChange = data => {
        const { onProductChange } = this.props;
        onProductChange(data);
    };

    render() {
        const { classes, item, onProductChange } = this.props;
        const productOptions = this.mapOptions(item.configurable_options);
        return (
            <div onChange={onProductChange} className={classes.root}>
                <div className={classes.colors}>
                    {productOptions.map((productOption, index) => {
                        return this.optionsComponent(productOption, index);
                    })}
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(ProductEdit);
