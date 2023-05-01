import { QwikMap } from './';
import { Marker } from './components/layers/markers';

import './global.css';

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Qwik Map</title>
      </head>
      <body>
        <QwikMap
          width="100vw"
          height="80vh"
          zoom={15}
          lat={52.5250701}
          lng={13.3977592}
        >
          <Marker
            lat={52.5250701}
            lng={13.3977592}
          />
        </QwikMap>
      </body>
    </>
  );
};
