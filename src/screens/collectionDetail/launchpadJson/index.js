import { Astroboy } from './Astroboy';
import { Genesis } from './genesis';
import { Land } from './land';
import { Ultraman } from './ultraman';
import { Deemo } from './Deemo';
import { Corporate } from './Corporate';
import { Penpenz } from './Penpenz';

export const getCollectionData = key => {
  switch (key) {
    case 'NFTDuel - Astroboy x Japan':
      return Astroboy;

    case 'XANA: Genesis':
      return Genesis;

    case 'XANA: LAND':
      return Land;

    case 'ULTRAMAN : NFTDuel Genesis':
      return Ultraman;

    case 'DEEMO THE MOVIE NFT':
      return Deemo;

    case 'Corporate Collaboration® T-Shirts':
      return Corporate;
      
    case 'XANA:PENPENZ x CryptoNinja':
      return Penpenz;

    default:
      return [];
  }
};
