import { createContextId } from "@builder.io/qwik";
import { MapStore } from "./";

export const QwikMapContext = createContextId<MapStore>("qwik-map-ctx");