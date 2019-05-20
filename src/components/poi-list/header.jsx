import React, { Fragment } from 'react';
import cx from 'classnames';
import { translate } from '../../services';
import { DetailHeader } from '../';
import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ query, setQuery, searchVisible, toggleSearch }) => (
  <DetailHeader className={styles.header}>
    {searchVisible && (
      <Fragment>
        <div
          className={cx(
            styles.headerButton,
            styles.headerButtonBack,
            global.ButtonColor
          )}
          onClick={toggleSearch}
        />
        <div className={cx(styles.searchProduct)}>
          <input
            type="text"
            value={query}
            onChange={({ target }) => setQuery(target.value)}
            placeholder={translate('SearchPlaceholder', false)}
          />
        </div>
      </Fragment>
    )}
    {!searchVisible && (
      <div className={styles.title}>{translate('NavigationHeader')}</div>
    )}
    <div
      className={cx(
        styles.headerButton,
        styles.headerButtonSearch,
        global.ButtonColor
      )}
      onClick={toggleSearch}
    />
  </DetailHeader>
);
