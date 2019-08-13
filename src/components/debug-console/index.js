import { compose, withState, withHandlers, lifecycle } from 'recompose';
import render from './template.jsx';

export const init = ({ logMessage }) => () => {
  oldLog = console.log;
  oldInfo = console.info;
  oldWarn = console.warn;
  oldError = console.error;

  Object.assign(window.console, {
    info: msg => logMessage(msg.toString(), 'info', oldInfo),
    log: msg => logMessage(msg.toString(), 'log', oldLog),
    warn: msg => logMessage(msg.toString(), 'warn', oldWarn),
    error: msg => logMessage(msg.toString(), 'error', oldError),
  });
};

export const destroy = () => () => {
  Object.assign(window.console, {
    info: oldInfo,
    log: oldLog,
    warn: oldWarn,
    error: oldError,
  });
};

export const logMessage = ({ setMessages, messages }) => (
  message,
  type,
  logFn
) => {
  messages.push({ time: new Date().toLocaleString(), message, type });
  setMessages(messages);
  logFn(message);
};

let oldLog, oldInfo, oldWarn, oldError;
export default compose(
  withState('messages', 'setMessages', []),
  withHandlers({
    logMessage,
  }),
  withHandlers({
    init,
    destroy,
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
    componentWillUnmount() {
      this.props.destroy();
    },
  })
)(render);
