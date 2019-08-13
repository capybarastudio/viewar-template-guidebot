import React from 'react';
import { compose, withProps, withState, withPropsOnChange } from 'recompose';

import render from './template.jsx';

const getButtonName = name => name.charAt(0).toUpperCase() + name.slice(1);

export default compose(
  withState('buttons', 'setButtons', []),
  withProps(() => ({
    getButtonName,
  })),
  withPropsOnChange(
    ['hidden'],
    ({
      hidden,
      setButtons,
      type,
      deleteVisible,
      saveVisible,
      undoVisible,
      placePoiVisible,
      initialHelp,
    }) => {
      if (!hidden) {
        let buttons = [];
        if (type === 'voice') {
          buttons.push('poi');
        } else if (type === 'manual') {
          buttons.push('menu');
        } else if (type === 'tour') {
          buttons.push('menu');
          buttons.push('pause');
        } else if (type === 'map-edit') {
          if (initialHelp) {
            buttons.push('placewaypoint', 'placepoi', 'delete', 'undo', 'save');
          } else {
            buttons.push('placewaypoint');
            if (placePoiVisible) {
              buttons.push('placepoi');
            }
            if (undoVisible) {
              buttons.push('undo');
            }
            if (deleteVisible) {
              buttons.push('delete');
            }
            if (saveVisible) {
              buttons.push('save');
            }
          }
        }
        setButtons(buttons);
      }
    }
  )
)(render);
