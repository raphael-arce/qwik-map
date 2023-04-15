import { QwikMap } from './';
import { Marker } from './components/layers/markers';

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Map</title>
      </head>
      <body>
        <QwikMap
          width="50vw"
          height="50vw"
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
