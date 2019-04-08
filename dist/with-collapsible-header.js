var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import memoize from 'fast-memoize';
import { View, StyleSheet, Animated, } from 'react-native';
const noop = () => {
    /**/
};
export const withCollapsibleHeader = (Component) => {
    var _a;
    const AnimatedComponent = Animated.createAnimatedComponent(Component);
    return _a = class CollapsibleHeaderView extends React.Component {
            constructor(props) {
                super(props);
                this.scrollAnim = new Animated.Value(0);
                this.offsetAnim = new Animated.Value(0);
                this.scrollValue = 0;
                this.offsetValue = 0;
                this.clampedScrollValue = 0;
                this.scrollEndTimer = 0;
                this.wrappedComponent = React.createRef();
                this.onScrollEndDrag = (event) => {
                    const { onScrollEndDrag = noop, disableHeaderSnap } = this.props;
                    if (!disableHeaderSnap) {
                        this.scrollEndTimer = setTimeout(this.onMomentumScrollEnd, 250);
                    }
                    onScrollEndDrag(event);
                };
                this.onMomentumScrollBegin = (event) => {
                    const { onMomentumScrollBegin = noop, disableHeaderSnap } = this.props;
                    if (!disableHeaderSnap) {
                        clearTimeout(this.scrollEndTimer);
                    }
                    onMomentumScrollBegin(event);
                };
                this.onMomentumScrollEnd = (event) => {
                    const { statusBarHeight, onMomentumScrollEnd = noop, headerHeight, disableHeaderSnap, } = this.props;
                    if (!disableHeaderSnap) {
                        this.moveHeader(this.scrollValue > headerHeight &&
                            this.clampedScrollValue > (headerHeight - statusBarHeight) / 2
                            ? this.offsetValue + headerHeight
                            : this.offsetValue - headerHeight);
                    }
                    onMomentumScrollEnd(event);
                };
                this.interpolatedHeaderTranslation = (from, to) => {
                    const { headerHeight, statusBarHeight } = this.props;
                    return this.clampedScroll.interpolate({
                        inputRange: [0, headerHeight - statusBarHeight],
                        outputRange: [from, to],
                        extrapolate: 'clamp',
                    });
                };
                this.animatedComponent = () => {
                    return this.wrappedComponent.current;
                };
                this.showHeader = (options) => {
                    this.moveHeader(this.offsetValue - this.props.headerHeight, !CollapsibleHeaderView.isAnimationConfig(options) || options.animated);
                };
                this.hideHeader = (options) => {
                    const { headerHeight } = this.props;
                    this.moveHeader(this.offsetValue + (this.scrollValue > headerHeight ? headerHeight : this.scrollValue), !CollapsibleHeaderView.isAnimationConfig(options) || options.animated);
                };
                const { headerHeight, statusBarHeight, footerHeight, keepHidden } = props;
                this.initAnimations(headerHeight, statusBarHeight, footerHeight);
                if (keepHidden) {
                    this.moveHeader(headerHeight, false);
                }
            }
            initAnimations(headerHeight, statusBarHeight, footerHeight) {
                this.scrollAnim.addListener(({ value }) => {
                    const diff = value - this.scrollValue;
                    this.scrollValue = value;
                    this.clampedScrollValue = Math.min(Math.max(this.clampedScrollValue + diff, 0), headerHeight - statusBarHeight);
                });
                this.offsetAnim.addListener(({ value }) => {
                    this.offsetValue = value;
                });
                this.clampedScroll = Animated.diffClamp(Animated.add(this.scrollAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolateLeft: 'clamp',
                }), this.offsetAnim), 0, headerHeight - statusBarHeight);
                this.clampedScrollFooter = Animated.diffClamp(Animated.add(this.scrollAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolateLeft: 'clamp',
                }), this.offsetAnim), 0, footerHeight);
                this.headerTranslation = this.clampedScroll.interpolate({
                    inputRange: [0, headerHeight - statusBarHeight],
                    outputRange: [0, -(headerHeight - statusBarHeight)],
                    extrapolate: 'clamp',
                });
                this.footerTranslation = Animated.add(this.clampedScrollFooter.interpolate({
                    inputRange: [0, footerHeight],
                    outputRange: [-footerHeight, 0],
                    extrapolate: 'clamp',
                }), footerHeight);
                this.currentHeaderHeight = headerHeight;
                this.currentStatusBarHeight = statusBarHeight;
            }
            cleanupAnimations() {
                this.scrollAnim.removeAllListeners();
                this.offsetAnim.removeAllListeners();
                clearTimeout(this.scrollEndTimer);
                if (this.headerSnap) {
                    this.headerSnap.stop();
                }
            }
            resetAnimations(headerHeight, statusBarHeight, footerHeight) {
                if (this.currentHeaderHeight !== headerHeight ||
                    this.currentStatusBarHeight !== statusBarHeight) {
                    this.cleanupAnimations();
                    this.initAnimations(headerHeight, statusBarHeight, footerHeight);
                }
            }
            componentWillUnmount() {
                this.cleanupAnimations();
            }
            componentDidUpdate(prevProps) {
                if (prevProps.keepHidden && !this.props.keepHidden) {
                    this.moveHeader(-this.props.headerHeight, true);
                }
                if (!prevProps.keepHidden && this.props.keepHidden) {
                    this.moveHeader(this.props.headerHeight, true);
                }
            }
            render() {
                const _a = this.props, { statusBarHeight, CollapsibleHeaderComponent, CollapsibleFooterComponent, contentContainerStyle, headerHeight, footerHeight, onScroll, headerContainerBackgroundColor, keepHidden } = _a, props = __rest(_a, ["statusBarHeight", "CollapsibleHeaderComponent", "CollapsibleFooterComponent", "contentContainerStyle", "headerHeight", "footerHeight", "onScroll", "headerContainerBackgroundColor", "keepHidden"]);
                this.resetAnimations(headerHeight, statusBarHeight, footerHeight);
                const headerProps = {
                    interpolatedHeaderTranslation: this.interpolatedHeaderTranslation,
                    showHeader: this.showHeader,
                    hideHeader: this.hideHeader,
                };
                const scrollProps = keepHidden
                    ? {}
                    : {
                        onMomentumScrollBegin: this.onMomentumScrollBegin,
                        onMomentumScrollEnd: this.onMomentumScrollEnd,
                        onScrollEndDrag: this.onScrollEndDrag,
                        onScroll: Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollAnim } } }], {
                            useNativeDriver: true,
                            listener: onScroll,
                        }),
                    };
                const Header = CollapsibleHeaderComponent;
                const Footer = CollapsibleFooterComponent;
                const styles = style(headerHeight, statusBarHeight, headerContainerBackgroundColor);
                return (<View style={styles.fill}>
          <AnimatedComponent bounces={false} overScrollMode={'never'} scrollEventThrottle={1} {...props} ref={this.wrappedComponent} contentContainerStyle={[contentContainerStyle, styles.container]} {...scrollProps}/>
          <Animated.View style={[styles.header, [{ transform: [{ translateY: this.headerTranslation }] }]]}>
            {React.isValidElement(Header) ? Header : <Header {...headerProps}/>}
          </Animated.View>
          <Animated.View style={[styles.footer, [{ transform: [{ translateY: this.footerTranslation }] }]]}>
            {React.isValidElement(Footer) ? Footer : null}
          </Animated.View>
        </View>);
            }
            static isAnimationConfig(options) {
                return options && options.animated !== undefined;
            }
            moveHeader(toValue, animated = true) {
                if (this.headerSnap) {
                    this.headerSnap.stop();
                }
                if (animated) {
                    this.headerSnap = Animated.timing(this.offsetAnim, {
                        toValue,
                        duration: this.props.headerAnimationDuration,
                        useNativeDriver: true,
                    });
                    this.headerSnap.start();
                }
                else {
                    this.offsetAnim.setValue(toValue);
                }
            }
        },
        _a.defaultProps = {
            statusBarHeight: 0,
            disableHeaderMomentum: false,
            headerMomentumDuration: 350,
            headerContainerBackgroundColor: 'white',
        },
        _a;
};
const style = memoize((headerHeight, statusBarHeight, headerBackgroundColor) => StyleSheet.create({
    fill: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: headerHeight,
        paddingTop: statusBarHeight,
        backgroundColor: headerBackgroundColor,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        paddingTop: headerHeight,
    },
}));
//# sourceMappingURL=with-collapsible-header.js.map