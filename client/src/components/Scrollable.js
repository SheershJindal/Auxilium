import Scrollbars from "react-custom-scrollbars";
import { Platform, ScrollView } from "react-native";

const Scrollable = ({ children }) => <>
    {Platform.OS == 'web' ? <Scrollbars>{children}</Scrollbars> : <ScrollView overScrollMode='never'>{children}</ScrollView>}
</>

export default Scrollable