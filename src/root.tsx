import { QwikMap } from './';

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
        />
      </body>
    </>
  );
};
