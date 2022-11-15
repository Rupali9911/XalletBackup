import {Astroboy} from './Astroboy';
import {Genesis} from './genesis';
import {Land} from './land';
import {Ultraman} from './ultraman';

export const getCollectionData = key => {
  switch (key) {
    case 'Astroboy : NFTDuel Genesis':
      return Astroboy;

    case 'XANA: Genesis':
      return Genesis;

    case 'XANA: LAND':
      return Land;

    case 'ULTRAMAN : NFTDuel Genesis':
      return Ultraman;

    default:
      return [];
  }
};
