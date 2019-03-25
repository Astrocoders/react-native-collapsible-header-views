import * as React from "react";
import * as RN from "react-native";

export class FlatList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.viewabilityConfig = this.props.viewabilityConfig || {
      itemVisiblePercentThreshold: 60
    };
  }

  render() {
    const { viewabilityConfig, ...props } = this.props;

    return (
      <RN.FlatList {...props} viewabilityConfig={this.viewabilityConfig} />
    );
  }
}
