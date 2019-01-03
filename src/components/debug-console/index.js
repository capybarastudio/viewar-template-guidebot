import { compose, withState, withHandlers, lifecycle } from 'recompose';
import render from './template.jsx';

let oldLog, oldInfo, oldWarn, oldError;
export default compose(
  withState('messages', 'setMessages', []),
  withHandlers({
    logMessage: ({ setMessages, messages }) => (message, type, logFn) => {
      messages.push({ time: new Date().toLocaleString(), message, type });
      setMessages(messages);
      logFn(message);
    },
  }),
  lifecycle({
    componentDidMount() {
      oldLog = console.log;
      oldInfo = console.info;
      oldWarn = console.warn;
      oldError = console.error;

      Object.assign(window.console, {
        info: msg => this.props.logMessage(msg.toString(), 'info', oldInfo),
        log: msg => this.props.logMessage(msg.toString(), 'log', oldLog),
        warn: msg => this.props.logMessage(msg.toString(), 'warn', oldWarn),
        error: msg => this.props.logMessage(msg.toString(), 'error', oldError),
      });
    },
    componentWillUnmount() {
      Object.assign(window.console, {
        info: oldInfo,
        log: oldLog,
        warn: oldWarn,
        error: oldError,
      });
    },
  })
)(render);
