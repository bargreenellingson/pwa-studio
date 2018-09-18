import { Component, createElement } from 'react';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './kebab.css';

class Kebab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    render() {
        const { classes, item, toggleKebab } = this.props;
        const toggleClass = this.state.isOpen ? classes.dropdown + ' ' + classes.active : classes.dropdown;
        const iconAttrs = { color: 'rgb(var(--venia-teal))'};

        return (
            <div className={classes.subMenu}>
              <button onClick={this.openDropdown} onBlur={this.closeDropdown}>
                <Icon name='more-vertical' attrs={iconAttrs} /> 
              </button>
                <ul className={toggleClass} onFocus={this.openDropdown} onBlur={this.closeDropdown}>
                  <li>
                    <a href="/">
                      <Icon name='heart' attrs={iconAttrs} />
                      Add to favorites
                    </a>
                  </li>
                  <li>
                    <a href="/">
                      <Icon name='edit-2' attrs={iconAttrs} />
                      Edit item
                    </a>
                  </li>
                  <li>
                    <button onClick={() => this.removeItem(item)}>
                      <Icon name='trash' attrs={iconAttrs}/>
                      Remove item
                    </button>
                  </li>
                </ul>
            </div>
        )
    }

    openDropdown = () => {
        this.setState({
            isOpen: true
        }); 
        this.props.toggleKebab(this.state.isOpen);
    }

    closeDropdown = () => {
        this.setState({
            isOpen: false
        });
        this.props.toggleKebab(this.state.isOpen);
    }

    removeItem = (item) => {
        this.props.removeItemFromCart(item);
    }
}

export default classify(defaultClasses)(Kebab);
