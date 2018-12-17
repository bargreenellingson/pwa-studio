import React, { Component } from 'react';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Section from 'src/components/Section';
import Pagination from 'src/components/Pagination';
import defaultClasses from './category.css';


class CategoryContent extends Component {

    selectSort = (sort, sortOrder) => {
        this.props.selectSort(sort, sortOrder);
    }

    render() {
        const { classes, pageControl, data, pageSize } = this.props;
        const { selectSort } = this;
        const items = data ? data.category.products.items : null;
        const title = data ? data.category.description : null;

        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                    <span
                        dangerouslySetInnerHTML={{
                            __html: title
                        }}
                    />
                </h1>
                <div className={classes.sortOptions}>
                    <p>Sort By</p>
                    <br />
                    <Section
                        disabled={false}
                        label="Price (Low to High)"
                        onClick={() => selectSort('price', 'ASC')}>
                    </Section>
                    <Section
                        disabled={false}
                        label="Price (High to Low)"
                        onClick={() => selectSort('price', 'DESC')}>
                    </Section>
                    <Section
                        disabled={false}
                        label="Name"
                        onClick={() => selectSort('name', 'ASC')}>
                    </Section>
                </div>
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

export default classify(defaultClasses)(CategoryContent);
