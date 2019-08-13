import React, { Fragment } from 'react';
import cx from 'classnames';
import { translate } from '../../services';
import { DetailHeader, IconButton } from '../';
import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ query, setQuery, searchVisible, toggleSearch, refs }) => (
  <DetailHeader dark className={styles.header}>
    {searchVisible && (
      <Fragment>
        <div className={cx(styles.searchProduct, global.CustomFont2)}>
          <input
            ref={element => refs.set('searchBar', element)}
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
    <IconButton
      icon={searchVisible ? 'close' : 'search'}
      size="small"
      className={cx(styles.headerButton, searchVisible && styles.isActive)}
      onClick={toggleSearch}
    />
  </DetailHeader>
);
