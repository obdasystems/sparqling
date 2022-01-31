import { bgpContainer } from "../../get-container";
import QueryGraphWidget from "./qg-widget";
import BGPRenderer from "./renderer";

export const qgWidget = new QueryGraphWidget(bgpContainer)
export const bgp = new BGPRenderer(bgpContainer)