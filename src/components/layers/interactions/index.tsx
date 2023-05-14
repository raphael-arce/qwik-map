import { $, component$, QwikMouseEvent, QwikTouchEvent, QwikWheelEvent, Slot, useContext } from '@builder.io/qwik';
import { MapStore, QwikMapContext } from '../../../store';
import { onWheel, onMouseDown, onMouseUp, onMouseMove, onDoubleClick } from '../../../interactions';
import { onTouchEnd, onTouchMove, onTouchStart } from '../../../interactions';

export const InteractionsLayer = component$(() => {
  const store: MapStore = useContext(QwikMapContext);

  const onWheelHandler = $((event: QwikWheelEvent<HTMLDivElement>) => onWheel(event, store));

  const onDoubleClickHandler = $((event: QwikMouseEvent<HTMLDivElement>) => onDoubleClick(event, store));

  const onMouseDownHandler = $((event: QwikMouseEvent<HTMLDivElement>) => onMouseDown(event));

  const onMouseMoveHandler = $((event: QwikMouseEvent<HTMLDivElement>) => onMouseMove(event, store));

  const onMouseUpHandler = $((event: QwikMouseEvent<HTMLDivElement>) => onMouseUp(event, store));

  const onTouchStartHandler = $((event: QwikTouchEvent<HTMLDivElement>) => onTouchStart(event));

  const onTouchMoveHandler = $((event: QwikTouchEvent<HTMLDivElement>) => onTouchMove(event, store));

  const onTouchEndHandler = $((event: QwikTouchEvent<HTMLDivElement>) => onTouchEnd(event));

  return (
    <div
      onWheel$={onWheelHandler}
      onDblClick$={onDoubleClickHandler}
      onMouseDown$={onMouseDownHandler}
      document:onMouseUp$={onMouseUpHandler}
      document:onMouseMove$={onMouseMoveHandler}
      style={`width:${store.width};height:${store.height};z-index:100`}
      onTouchStart$={onTouchStartHandler}
      preventdefault:touchstart
      onTouchMove$={onTouchMoveHandler}
      preventdefault:touchmove
      onTouchEnd$={onTouchEndHandler}
      preventdefault:touchend
    >
      <Slot />
    </div>
  );
});
