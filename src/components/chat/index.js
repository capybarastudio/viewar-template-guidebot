import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
  withPropsOnChange,
} from 'recompose';
import render from './template.jsx';

import guide from 'viewar-guide';
import { withRefs } from '../../utils';

const SCROLL_DURATION = 500;

let scrollMutex = Promise.resolve();
const queueScrollUpdate = fn => (scrollMutex = scrollMutex.then(fn, fn));

export const init = ({ scrollToBottom, onSpeechInput }) => () => {
  queueScrollUpdate(() => scrollToBottom(SCROLL_DURATION));

  guide.on('guideSpeaking', onSpeechInput);
  guide.on('userInput', onSpeechInput);
};

export const destroy = ({ onSpeechInput }) => () => {
  guide.off('guideSpeaking', onSpeechInput);
  guide.off('userInput', onSpeechInput);
};

export const scrollToBottom = ({ refs }) => duration =>
  new Promise(resolve => {
    setTimeout(() => {
      const div = refs['chat'];

      const scrollHeight = div.scrollTop,
        scrollMax = div.scrollHeight,
        margin = 1,
        scrollStep = Math.PI / (duration / 15),
        cosParameter = (scrollMax - scrollHeight) / 2;
      let scrollCount = 0,
        scrollMargin,
        scrollInterval = setInterval(function() {
          scrollCount = scrollCount + 1;
          scrollMargin =
            cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
          let scrollY = scrollHeight + scrollMargin;
          if (scrollY >= scrollMax - margin) {
            scrollY = scrollMax;
            clearInterval(scrollInterval);
            resolve();
          }
          div.scrollTop = scrollY;
        }, 15);
    }, 10);
  });

export const onSpeechInput = ({
  conversation,
  setConversation,
  scrollToBottom,
  active,
}) => input => {
  if (active) {
    if (input.speaker && input.sentence) {
      conversation.push(input);
      queueScrollUpdate(() => setConversation(conversation));
      queueScrollUpdate(() => scrollToBottom(SCROLL_DURATION));
    }
  }
};

export default compose(
  withRefs,
  withState('conversation', 'setConversation', []),
  withHandlers({
    scrollToBottom,
  }),
  withHandlers({
    onSpeechInput,
  }),
  withPropsOnChange(['active'], ({ active, setConversation }) => {
    setConversation([]);
    return { active };
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
