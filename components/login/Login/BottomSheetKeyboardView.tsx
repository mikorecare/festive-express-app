import {
    SCROLLABLE_TYPE,
    createBottomSheetScrollableComponent,
    type BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import type { BottomSheetScrollViewProps } from "@gorhom/bottom-sheet/src/components/bottomSheetScrollable/types";
import { memo } from "react";
import { ScrollViewProps as RNScrollViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";

type KeyboardAwareScrollViewProps = {
  bottomOffset?: number;
  disableScrollOnKeyboardHide?: boolean;
  enabled?: boolean;
} & RNScrollViewProps;

const AnimatedScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

const BottomSheetScrollViewComponent = createBottomSheetScrollableComponent<
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps
>(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView);

const BottomSheetKeyboardAwareScrollView = memo(BottomSheetScrollViewComponent);

BottomSheetKeyboardAwareScrollView.displayName =
  "BottomSheetKeyboardAwareScrollView";

export default BottomSheetKeyboardAwareScrollView as (
  props: BottomSheetScrollViewProps,
) => ReturnType<typeof BottomSheetKeyboardAwareScrollView>;
