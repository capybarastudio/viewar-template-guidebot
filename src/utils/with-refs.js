import { withProps } from 'recompose';

class RefsStore {
  set(name, value) {
    this[name] = value;
  }
}

export const withRefs = withProps({ refs: new RefsStore() });
