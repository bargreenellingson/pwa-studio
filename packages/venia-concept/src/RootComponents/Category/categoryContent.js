import React, { Component } from 'react';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import defaultClasses from './category.css';

class CategoryContent extends Component {
    render() {
        const { classes, pageControl, data, pageSize } = this.props;
        const items = data ? data.category.products.items : null;
        const description = data ? data.category.description : null;
        const name = data ? data.category.name : null;
        const productCount = data ? data.category.product_count : null;

        return (
            <article className={classes.root}>
                <section className={classes.gallery}>
                    <Gallery
                        data={items}
                        name={name}
                        productCount={productCount}
                        description={description}
                        pageSize={pageSize}
                    />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
            </article>
        );
    }
}

export default classify(defaultClasses)(CategoryContent);
