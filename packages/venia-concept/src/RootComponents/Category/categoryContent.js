import React, { Component } from 'react';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Section from 'src/components/Section';
import Pagination from 'src/components/Pagination';
import defaultClasses from './category.css';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import Trigger from 'src/components/Trigger';
import { withRouter } from 'react-router';
import Mask from 'src/components/Mask';

class CategoryContent extends Component {
    selectSort = (options, index) => {
        this.setState({
            selectedOption: index
        });
    };

    componentDidMount() {
        const { sortOptions } = this.state;
        sortOptions.forEach((option, index) => {
            if (
                option.value.sort === this.props.sort &&
                option.value.sortOrder === this.props.sortOrder
            ) {
                this.setState({
                    selectedOption: index
                });
            }
        });
    }

    state = {
        sortOptions: [
            {
                children: 'Price (Low to High)',
                value: { sort: 'price', sortOrder: 'ASC' }
            },
            {
                children: 'Price (High to Low)',
                value: { sort: 'price', sortOrder: 'DESC' }
            },
            {
                children: 'Newest',
                value: { sort: 'name', sortOrder: 'ASC' }
            },
            {
                children: 'Ratings: High to Low',
                value: { sort: 'ratings', sortOrder: 'DESC' }
            },
            {
                children: 'A-Z',
                value: { sort: 'name', sortOrder: 'ASC' }
            },
            {
                children: 'Z-A',
                value: { sort: 'name', sortOrder: 'DESC' }
            }
        ],
        selectedOption: 0,
        isSortComponentOpen: false
    };

    addSortToHistory = () => {
        const { history } = this.props;
        const selectedSort = this.state.sortOptions[this.state.selectedOption];
        const params = new URLSearchParams(selectedSort.value);

        history.push({
            pathname: location.pathname,
            search: params.toString()
        });
        this.toggleSortComponent();
    };

    applySortFromURLParams = paramsString => {
        const searchParams = new URLSearchParams(paramsString);
        this.props.applySort(
            searchParams.get('sort'),
            searchParams.get('sortOrder')
        );
    };

    get sortComponent() {
        const { classes } = this.props;
        const { selectSort, closeSortButton, addSortToHistory } = this;
        const { isSortComponentOpen, sortOptions, selectedOption } = this.state;
        const sections = sortOptions.map((options, index) => {
            selectedOption === index
                ? (options.selectedOption = true)
                : (options.selectedOption = false);

            return (
                <Section
                    key={index}
                    {...options}
                    onClick={() => selectSort(options.value, index)}
                />
            );
        });

        const className = isSortComponentOpen
            ? `${classes.sortOptions} ${classes.hidden}`
            : classes.sortOptions;

        return (
            <div className={className}>
                <h2>
                    <span> Sort By {closeSortButton}</span>
                </h2>
                <div className={classes.sections}>{sections}</div>
                <Button onClick={addSortToHistory}> Apply </Button>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        const prevLocation = prevProps.location;
        const { location } = this.props;
        if (prevLocation && prevLocation.search !== location.search) {
            this.applySortFromURLParams(location.search);
        }
    }

    get closeSortButton() {
        const { toggleSortComponent } = this;
        return (
            <Trigger action={() => toggleSortComponent()}>
                {' '}
                <Icon name="x" />{' '}
            </Trigger>
        );
    }

    toggleSortComponent = () => {
        const { isSortComponentOpen } = this.state;
        this.setState({
            isSortComponentOpen: !isSortComponentOpen
        });
    };

    render() {
        const { classes, pageControl, data, pageSize } = this.props;
        const items = data ? data.category.products.items : null;
        const title = data ? data.category.description : null;
        const { isSortComponentOpen } = this.state;

        const { sortComponent, toggleSortComponent } = this;

        return (
            <article className={classes.root}>
                <Mask
                    isActive={isSortComponentOpen}
                    dismiss={toggleSortComponent}
                />

                <Button onClick={() => toggleSortComponent()}> Sort </Button>
                <h1 className={classes.title}>
                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                    <span
                        dangerouslySetInnerHTML={{
                            __html: title
                        }}
                    />
                </h1>
                {sortComponent}
                <section className={classes.gallery}>
                    <Gallery data={items} title={title} pageSize={pageSize} />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
            </article>
        );
    }
}

export default withRouter(classify(defaultClasses)(CategoryContent));
