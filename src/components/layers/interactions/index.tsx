import { $, component$, QwikMouseEvent, QwikTouchEvent, QwikWheelEvent, Slot, useContext } from '@builder.io/qwik';
import { MapStore, QwikMapContext } from '../../../store/map';
import { onWheel, onMouseDown, onMouseUp, onMouseMove } from '../../../interactions';
import { onTouchEnd, onTouchMove, onTouchStart } from '../../../interactions/touch';

export const InteractionsLayer = component$(() => {
  const store: MapStore = useContext(QwikMapContext);

  const onWheelHandler = $((event: QwikWheelEvent<HTMLDivElement>) => onWheel(event, store));

  const onMouseDownHandler = $((event: QwikMouseEvent<HTMLDivElement>) => onMouseDown(event, store));

  const onMouseMoveHandler = $((event: QwikMouseEvent<HTMLDivElement>) => onMouseMove(event, store));

  const onMouseUpHandler = $((event: QwikMouseEvent<HTMLDivElement>) => onMouseUp(event, store));

  const onTouchStartHandler = $((event: QwikTouchEvent<HTMLDivElement>) => onTouchStart(event, store));

  const onTouchMoveHandler = $((event: QwikTouchEvent<HTMLDivElement>) => onTouchMove(event, store));

  const onTouchEndHandler = $((event: QwikTouchEvent<HTMLDivElement>) => onTouchEnd(event, store));

  return (
    <div
      onWheel$={onWheelHandler}
      onMouseDown$={onMouseDownHandler}
      document:onMouseUp$={onMouseUpHandler}
      document:onMouseMove$={onMouseMoveHandler}
      style={`width:${store.width};height:${store.height};z-index:100`}
      onTouchStart$={onTouchStartHandler}
      onTouchMove$={onTouchMoveHandler}
      onTouchEnd$={onTouchEndHandler}
    >
      <Slot />
    </div>
  );
});
