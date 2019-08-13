import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ active, conversation, refs, className }) => (
  <div
    className={cx(styles.chat, className, active && styles.isVisible)}
    ref={element => refs.set('chat', element)}
  >
    <div
      className={styles.messages}
      ref={element => refs.set('messages', element)}
    >
      {conversation
        .filter((message, index) => index >= conversation.length - 2)
        .map(({ speaker, sentence }, index) => (
          <div
            key={index}
            className={cx(
              styles.message,
              styles[`speaker-${speaker}`],
              speaker === 'guide' && global.ButtonColor
            )}
          >
            <span>{sentence}</span>
          </div>
        ))}
    </div>
  </div>
);
