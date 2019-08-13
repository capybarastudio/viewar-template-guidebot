import pick from 'lodash/pick';
import { clone } from '../../utils';
import { appState } from '../../services';
export default ({ findInstance, removeInstance, ...initialProps }) => {
  const props = clone(initialProps);

  const getModel = () =>
    findInstance(props.id) ? findInstance(props.id).model : props.model;

  const getPose = () =>
    findInstance(props.id) ? findInstance(props.id).pose : props.pose;

  const getPropertyValues = () =>
    findInstance(props.id)
      ? findInstance(props.id).propertyValues
      : props.propertyValues;

  const getVisible = () =>
    findInstance(props.id) ? findInstance(props.id).visible : props.visible;

  const toJSON = () =>
    pick(
      findInstance(props.id)
        ? { ...findInstance(props.id), data: props.data, $id: props.$id }
        : props,
      ['$id', 'model', 'pose', 'data']
    );

  const remove = () =>
    findInstance(props.id) &&
    (appState.sceneStateMutex = appState.sceneStateMutex.then(
      () => removeInstance(props.id),
      () => removeInstance(props.id)
    ));

  return {
    get $id() {
      return props.$id;
    },
    get id() {
      return props.id;
    },
    set id(newId) {
      props.id = newId;
    },
    get model() {
      return getModel();
    },
    get data() {
      return props.data;
    },
    get pose() {
      return getPose();
    },
    get propertyValues() {
      return getPropertyValues();
    },
    get visible() {
      return getVisible();
    },
    remove,
    toJSON,
  };
};
