import React, { Fragment } from 'react';
import cx from 'classnames';
import { translate } from '../../services/translations';
import DetailHeader from '../detail-header';
import styles from './styles.css';
import globalStyles from '../../../css/global.css';

export default ({ query, setQuery, searchVisible, toggleSearch }) => (
  <DetailHeader className={styles.header}>
    {searchVisible && (
      <Fragment>
        <div
          className={cx(
            styles.headerButton,
            styles.headerButtonBack,
            globalStyles.ButtonColor
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
        globalStyles.ButtonColor
      )}
      onClick={toggleSearch}
    />
  </DetailHeader>
);
