import { withCollapsibleHeader } from "./with-collapsible-header";
import { ScrollView, SectionList } from "react-native";
// @ts-ignore
import { FlatList } from "./flatlist";
export { withCollapsibleHeader } from "./with-collapsible-header";
export const CollapsibleHeaderScrollView = withCollapsibleHeader(ScrollView);
export const CollapsibleHeaderFlatList = withCollapsibleHeader(FlatList);
export const CollapsibleHeaderSectionList = withCollapsibleHeader(SectionList);
//# sourceMappingURL=index.js.map