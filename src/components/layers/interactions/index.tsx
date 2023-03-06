import {
  $,
  component$,
  QwikMouseEvent,
  QwikWheelEvent,
  Slot,
  useContext,
} from "@builder.io/qwik";
import { MapStore, QwikMapContext } from "../../../store/map";
import {
  onWheel,
  onMouseDown,
  onMouseUp,
  onMouseMove,
} from "../../../interactions";

export const InteractionsLayer = component$(() => {
  const store: MapStore = useContext(QwikMapContext);

  const onWheelHandler = $((event: QwikWheelEvent<HTMLDivElement>) =>
    onWheel(event, store),
  );

  const onMouseDownHandler = $((event: QwikMouseEvent<HTMLDivElement>) =>
    onMouseDown(event, store),
  );

  const onMouseUpHandler = $((event: QwikMouseEvent<HTMLDivElement>) =>
    onMouseUp(event, store),
  );

  const onMouseMoveHandler = $((event: QwikMouseEvent<HTMLDivElement>) => {
    onMouseMove(event, store);
  });

  return (
    <div
      onWheel$={onWheelHandler}
      onMouseDown$={onMouseDownHandler}
      document:onMouseUp$={onMouseUpHandler}
      document:onMouseMove$={onMouseMoveHandler}
      style={`width:${store.width};height:${store.height};z-index:100`}
    >
      <Slot />
    </div>
  );
});
