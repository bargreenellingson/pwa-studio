import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classify from 'src/classify';
import { setCurrentPage, setPrevPageTotal, setSort, setSortOrder } from 'src/actions/catalog';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';

const categoryQuery = gql`
    query category($id: Int!, $pageSize: Int!, $currentPage: Int!) {
        category(id: $id) {
            id
            description
            name
            product_count
            products(pageSize: $pageSize, currentPage: $currentPage, sort: {name:DESC}) {
                items {
                    id
                    name
                    small_image
                    url_key
                    price {
                        regularPrice {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                }
                total_count
            }
        }
    }
`;

class Category extends Component {
    static propTypes = {
        id: number,
        classes: shape({
            gallery: string,
            root: string,
            title: string
        }),
        currentPage: number,
        pageSize: number,
        prevPageTotal: number,
        sort: string,
        sortOrder: string
    };

    // TODO: Should not be a default here, we just don't have
    // the wiring in place to map route info down the tree (yet)
    static defaultProps = {
        id: 3,
    };

    applySort = (sort, sortOrder) => {
        const { setSort, setSortOrder } = this.props;
        setSort(sort);
        setSortOrder(sortOrder);
    }

    render() {
        const {
            classes,
            currentPage,
            id,
            pageSize,
            prevPageTotal,
            setCurrentPage,
            setPrevPageTotal,
            sort,
            sortOrder,
        } = this.props;

        const { applySort } = this;

        const pageControl = {
            currentPage: currentPage,
            setPage: setCurrentPage,
            updateTotalPages: setPrevPageTotal,
            totalPages: prevPageTotal
        };

        return (
            <Query
                query={categoryQuery}
                variables={{
                    id: Number(id),
                    pageSize: Number(pageSize),
                    currentPage: Number(currentPage),
                    sort: String(sort),
                    sortOrder: String(sortOrder)
                }}
            >
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading)
                        return pageControl.totalPages ? (
                            <CategoryContent
                                pageControl={pageControl}
                                pageSize={pageSize}
                            />
                        ) : (
                            <div className={classes.placeholder}>
                                Fetching Data...
                            </div>
                        );

                    // Retrieve the total page count from GraphQL when ready
                    const pageCount =
                        data.category.products.total_count / pageSize;
                    const totalPages = Math.ceil(pageCount);
                    const totalWrapper = {
                        ...pageControl,
                        totalPages: totalPages
                    };

                    return (
                        <CategoryContent
                            classes={classes}
                            pageControl={totalWrapper}
                            data={data}
                            applySort={applySort}
                            sort={sort}
                            sortOrder={sortOrder}
                        />
                    );
                }}
            </Query>
        );
    }
}

const mapStateToProps = ({ catalog }) => {
    return {
        currentPage: catalog.currentPage,
        pageSize: catalog.pageSize,
        prevPageTotal: catalog.prevPageTotal,
        sort: catalog.sort,
        sortOrder: catalog.sortOrder
    };
};
const mapDispatchToProps = { setCurrentPage, setPrevPageTotal, setSortOrder, setSort };

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Category);
