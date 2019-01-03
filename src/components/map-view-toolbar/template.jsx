import React, { Fragment } from 'react';
import cx from 'classnames';
import styles from './styles.css';

import Button from '../../components/button';

export default ({
  activateMapEnabled,
  openDeletePrompt,
  openActivatePrompt,
  goToNavigate,
  togglePoiList,
  goToMapEdit,
  visible,
  ...props
}) => (
  <div className={cx(styles.container, !visible && styles.isHidden)}>
    <Button
      className={styles.button}
      label="Pois"
      onClick={() => togglePoiList()}
    />
    <Button
      className={styles.button}
      label="Edit"
      onClick={() => goToMapEdit()}
    />
    <Button
      className={styles.button}
      label="Delete"
      onClick={() => openDeletePrompt()}
    />
    <Button
      className={styles.button}
      label="Navigate"
      onClick={() => goToNavigate()}
    />
    {activateMapEnabled && (
      <Button
        className={styles.button}
        label="Activate"
        onClick={() => openActivatePrompt()}
      />
    )}
  </div>
);
