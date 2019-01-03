import React, { Fragment } from 'react';
import classNames from 'classnames';
import Button from '../button';
import { translate } from '../../services/translations';
import styles from './styles.css';

export default ({
  visible,
  onClick,
  className,
  resetTracking,
  admin,
  screen,
  changeScreen,
  toggleHelp,
  undoVisible,
  placePoiVisible,
  deleteVisible,
  saveVisible,
  ...props
}) => (
  <div
    className={classNames(
      styles.container,
      visible && styles.isVisible,
      className
    )}
    onClick={toggleHelp}
  >
    <div className={styles.buttonContainer}>
      <Button
        className={classNames(styles.button)}
        onClick={resetTracking}
        label="HelpResetTracking"
      />
    </div>

    {!admin && (
      <Fragment>
        {screen === 'buttons' && (
          <div>
            <div
              className={classNames(styles.help, styles.right1, styles.left)}
            >
              <div className={classNames(styles.line)} />
              <div className={classNames(styles.message)}>
                {translate('HelpSelectPoi')}
              </div>
            </div>
          </div>
        )}
      </Fragment>
    )}

    {admin && (
      <Fragment>
        {screen === 'buttons' && (
          <div>
            <div
              className={classNames(styles.help, styles.right1, styles.left)}
            >
              <div className={classNames(styles.line)} />
              <div className={classNames(styles.message)}>
                {translate('HelpPlaceWaypoint')}
              </div>
            </div>
            {placePoiVisible && (
              <div
                className={classNames(styles.help, styles.right2, styles.left)}
              >
                <div className={classNames(styles.line)} />
                <div className={classNames(styles.message)}>
                  {translate('HelpPlacePoi')}
                </div>
              </div>
            )}
            {undoVisible && (
              <div
                className={classNames(styles.help, styles.right3, styles.left)}
              >
                <div className={classNames(styles.line)} />
                <div className={classNames(styles.message)}>
                  {translate('HelpUndo')}
                </div>
              </div>
            )}
            {deleteVisible && (
              <div
                className={classNames(styles.help, styles.right4, styles.left)}
              >
                <div className={classNames(styles.line)} />
                <div className={classNames(styles.message)}>
                  {translate('HelpDeletePoi')}
                </div>
              </div>
            )}
            {saveVisible && (
              <div
                className={classNames(styles.help, styles.left1, styles.top)}
              >
                <div className={classNames(styles.line)} />
                <div className={classNames(styles.message)}>
                  {translate('HelpSave')}
                </div>
              </div>
            )}
          </div>
        )}
      </Fragment>
    )}
  </div>
);
