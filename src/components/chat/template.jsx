import React from 'react';
import cx from 'classnames';

import styles from './styles.scss';
import global from '../../../css/global.scss';

export default ({ active, conversation, addRef, className }) => (
  <div
    className={cx(styles.chat, className, active && styles.isVisible)}
    ref={addRef('chat')}
  >
    <div className={styles.messages} ref={addRef('messages')}>
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
