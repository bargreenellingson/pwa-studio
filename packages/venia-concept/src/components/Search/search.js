import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import classify from 'src/classify';
import defaultClasses from './search.css';

class Search extends Component {
    static propTypes = {
      classes: PropTypes.shape({
        searchBlock: PropTypes.string,
        searchBlock_open: PropTypes.string
      }) 
    };

    constructor(props) {
      super(props);
      this.state = {searchInput : ''};
    }

    render() {
      const { classes, isOpen } = this.props;

      const searchQuery = gql`
        query ($inputText: String) {
          products (search : $inputText) {
            items {
              name
              id
            }
          }
        }
      `;

      const searchClass = isOpen ? classes.searchBlock_open : classes.searchBlock;

      //Handle enter key to search!
      const handleKeyPress = (event) => {
          console.log("entered key!");
          if (event.key === "Enter") {
            this.setState ({
              searchInput : event.target.value
            });
            console.log(event.target.value);  
          }
      };
      return (
          <div className={searchClass}>   
              <input
                className={classes.searchInput}
                type="text"
                placeholder="I'm looking for..."
                onKeyPress={handleKeyPress}
              />
              <Query query={searchQuery} variables={{ "inputText" : this.state.searchInput}}> 
                {({ loading, error, data }) => {
                  if (loading) return "Loading";
                  if (error) return `Error ${error.message}`;

                  return (
                    <div>
                      {data.products.items.map(item => (
                      <span>
                        {item.name}
                      </span>
                      ))}
                    </div>
                  );
                }}
              </Query>
          </div>
      );
    }
}

export default classify(defaultClasses)(Search);
