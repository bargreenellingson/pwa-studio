import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './search.css';

class Search extends Component {
    static propTypes = {
      classes: PropTypes.shape({
        searchBlock: PropTypes.string,
        searchBlock_open: PropTypes.string
      }) 
    };

    render() {
      const { classes, isOpen } = this.props;

      const searchClass = isOpen ? classes.searchBlock_open : classes.searchBlock; 

      const handleKeyPress = (event) => {
          console.log("entered key!");
      };
      return (
          <div className={searchClass}>   
              <input
                className={classes.searchInput}
                type="text"
                placeholder="I'm looking for..."
                onKeyPress={handleKeyPress}
              />
          </div>
      );
    }
}

export default classify(defaultClasses)(Search);
