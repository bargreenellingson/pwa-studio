import { Component } from 'react';
import { connect } from 'react-redux'; 
import { string, bool } from 'prop-types';

import { queryLoadStart, queryLoadEnd } from 'src/actions/app/';

class LoaderAction extends Component {
    static propTypes = {
      text: string,
      loading: bool
    };

    componentDidMount() {
        if (this.props.loading) {
            this.props.queryLoadStart(this.props.text);
        } else {
            this.props.queryLoadEnd(null);
        }
    }

    render() {
        return null;
    }
}

const mapDispatchToProps = {
    queryLoadStart,
    queryLoadEnd
};

export default connect(
  null,
  mapDispatchToProps
)(LoaderAction);
