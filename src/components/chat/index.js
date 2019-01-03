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

export const createRefCalls = () => {
  const refs = {};
  return {
    getRefs: () => () => refs,
    addRef: () => name => ref => {
      refs[name] = ref;
    },
  };
};

const SCROLL_DURATION = 500;

let scrollMutex = Promise.resolve();
const queueScrollUpdate = fn => (scrollMutex = scrollMutex.then(fn, fn));

export default compose(
  withState('conversation', 'setConversation', []),
  withProps({
    guide,
  }),
  withHandlers(createRefCalls()),
  withHandlers({
    scrollToBottom: ({ getRefs }) => duration =>
      new Promise(resolve => {
        setTimeout(() => {
          const div = getRefs().chat;

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
                cosParameter -
                cosParameter * Math.cos(scrollCount * scrollStep);
              let scrollY = scrollHeight + scrollMargin;
              if (scrollY >= scrollMax - margin) {
                scrollY = scrollMax;
                clearInterval(scrollInterval);
                resolve();
              }
              div.scrollTop = scrollY;
            }, 15);
        }, 10);
      }),
  }),
  withHandlers({
    onSpeechInput: ({
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
    },
  }),
  withPropsOnChange(['active'], ({ active, setConversation }) => {
    setConversation([]);
    return { active };
  }),
  lifecycle({
    componentDidMount() {
      const { scrollToBottom, guide, onSpeechInput } = this.props;
      queueScrollUpdate(() => scrollToBottom(SCROLL_DURATION));

      guide.on('guideSpeaking', onSpeechInput);
      guide.on('userInput', onSpeechInput);
    },
    componentWillUnmount() {
      const { guide, onSpeechInput } = this.props;

      guide.off('guideSpeaking', onSpeechInput);
      guide.off('userInput', onSpeechInput);
    },
  })
)(render);
