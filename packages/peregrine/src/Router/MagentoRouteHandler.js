import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';

import fetchRootComponent from 'FETCH_ROOT_COMPONENT';
import resolveUnknownRoute from './resolveUnknownRoute';

const InternalError = Symbol('InternalError');
const NotFound = Symbol('NotFound');
const mountedInstances = new WeakSet();

export default class MagentoRouteHandler extends Component {
    static propTypes = {
        apiBase: string.isRequired,
        children: func,
        location: shape({
            pathname: string.isRequired
        }).isRequired
    };

    state = {
        componentMap: new Map(),
        errorState: {
            hasError: false,
            internalError: false,
            notFound: false
        },
        renderRoot: null,
        renderChildren: null
    };

    componentDidMount() {
        mountedInstances.add(this);
        this.getRouteComponent(this.props.location.pathname);
        this.loadingPage();
    }

    componentDidUpdate(prevProps, prevState) {
        const { props, state } = this;
        const { pathname } = props.location;
        const isKnown = state.componentMap.has(pathname);
        const prevIsKnown = prevState.componentMap.has(pathname);
        const prevPathname = prevProps.location.pathname;
        const prevErrorState = prevState.errorState;

        if (this.props !== prevProps || isKnown !== prevIsKnown || state.errorState !== prevErrorState){
            if (pathname !== prevPathname) {
                this.getRouteComponent(pathname);
                if (!isKnown) {
                    // If no record of this page in componentMap, then load
                    this.loadingPage();
                }
            } else if (isKnown) {
                // if Known, have some RootComponent to render
                this.displayPage(prevIsKnown, pathname, prevPathname, prevErrorState);
            }
        }
    }

    loadingPage() {
        let errorState = this.state.errorState;
        let setChildren = null;
        let renderRoot = this.state.renderRoot;
        
        //render children to display errorPage or loading page
        if (errorState.hasError) {
            setChildren = false;
        } else {
            setChildren = true;
        }        
        
        if (renderRoot !== null) {
            this.setState({
                renderRoot: null
            });
        }
        console.log("set in loading");
        this.setChildren(setChildren);        
    }

    displayPage(prevIsKnown, pathname, prevPathname, prevErrorState) {
        const errorState = this.state.errorState;
        let renderRoot = this.state.renderRoot;
        let setChildren = null;

        if (errorState.hasError) {
            renderRoot = null;
            setChildren = false;
        } else { 
            // If just finished loading, loading graphQL query, path updated to a known query, or if leaving error page
            if (!prevIsKnown || this.props.queryLoading || pathname !== prevPathname || errorState !== prevErrorState ) {
                const { RootComponent, ...routeProps} = this.state.componentMap.get(pathname);
                renderRoot = <RootComponent {...routeProps} />;
                //Continue to render children so loader has a chance to display graphQL loading if needed
                setChildren = true;
            } else {
                //Once any queries have loaded, or if queries don't exist on page, remove children
                setChildren = null;
            }
        }
        if (renderRoot !== this.state.renderRoot) { 
            this.setState({
                renderRoot: renderRoot
            });
        }
        console.log("set in display");
        this.setChildren(setChildren);
    }

    componentWillUnmount() {
        mountedInstances.delete(this);
    }

    async getRouteComponent() {
        const {
            apiBase,
            location: { pathname }
        } = this.props;

        try {
            // try to resolve the route
            // if this throws, we essentially have a 500 Internal Error
            const resolvedRoute = await resolveUnknownRoute({
                apiBase,
                route: pathname
            });

            const { type, id } = resolvedRoute;

            // if resolution and destructuring succeed but return no match
            // then we have a straightforward 404 Not Found
            if (!type || !id) {
                throw new Error('404');
            }

            // at this point we should have a matching RootComponent
            // if this throws, we essentially have a 500 Internal Error
            const RootComponent = await fetchRootComponent(type);

            // associate the matching RootComponent with this location
            this.setRouteComponent(pathname, RootComponent, { id });
        } catch ({ message }) {
            const symbol = message === '404' ? NotFound : InternalError;

            // we don't have a matching RootComponent, but we've checked for one
            // so associate the appropriate error case with this location
            this.setRouteComponent(pathname, symbol);
        }
    }

    setRouteComponent(pathname, RootComponent, meta) {
        if (!mountedInstances.has(this)) {
            // avoid setState if component is not mounted for any reason
            return;
        }

        this.setState(({ componentMap }) => ({
            componentMap: new Map(componentMap).set(pathname, {
                RootComponent,
                ...meta
            }),
            errorState: {
                hasError: typeof RootComponent === 'symbol',
                internalError: RootComponent === InternalError,
                notFound: RootComponent === NotFound
            }
        }));
    }

    setChildren(loading) {
        const { props, state } = this;
        const { children, loadMessage } = props;
        const { errorState } = state;
        this.setState ({
            renderChildren: loading === null
                ? null
                : typeof children === 'function'
                    ? children({ ...errorState, loading, loadMessage })
                    : null
        });
    }

    render() {        
        return (
            <span>
                { this.state.renderChildren }
                { this.state.renderRoot }
            </span>
        );
    }
}
