import React from 'react';
import cx from 'classnames';
import { IconButton } from '../';
import { translate } from '../../services';
import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({
  projects,
  projectId,
  loadProject,
  createNewProject,
  loadDialogVisible,
  parseTime,
}) => (
  <div className={cx(styles.loadDialog, loadDialogVisible && styles.isVisible)}>
    <div className={styles.projects}>
      {projects.map(({ info = {}, id }) => (
        <div
          className={cx(styles.project, projectId === id && styles.isActive)}
          key={id}
          onClick={() => loadProject(id)}
        >
          {/* <IconButton
            className={styles.icon}
            icon={projectId === id ? 'active' : 'none'}
            size="small"
          /> */}
          <div className={styles.details}>
            <div className={styles.title}>
              <span>
                {info.name || id}
                {projectId === id ? ' (active)' : ''}
              </span>
            </div>
            {info.timestamp && (
              <div className={styles.timestamp}>
                <span>{parseTime(info.timestamp)}</span>
              </div>
            )}
          </div>
          <IconButton
            className={cx(styles.icon, styles.iconNext)}
            icon="openProject"
            size="small"
          />
        </div>
      ))}
    </div>
    <div className={styles.newProject}>
      <IconButton
        className={cx(styles.icon, styles.iconNew)}
        icon="add"
        size="small"
      />
      <div
        className={cx(styles.project, global.ButtonColor)}
        onClick={() => createNewProject()}
      >
        <div className={styles.title}>{translate('AdminNewProject')}</div>
      </div>
    </div>
  </div>
);
