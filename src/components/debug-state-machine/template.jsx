import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ enabled, mainStates, detailStates, input }) => (
  <>
    {!!enabled && (
      <div className={cx(styles.container)}>
        <u>Main State History:</u>
        <br />
        {mainStates.slice(-10).map(state => (
          <>
            {state}
            <br />
          </>
        ))}
        <br />
        <u>Detail State History:</u>
        <br />
        {detailStates.slice(-10).map(state => (
          <>
            {state}
            <br />
          </>
        ))}
        <br />
        <u>User Input:</u>
        <br />
        {Object.entries(input).map(([key, value]) => (
          <>
            {key}: {JSON.stringify(value)}
            <br />
          </>
        ))}
      </div>
    )}
  </>
);
