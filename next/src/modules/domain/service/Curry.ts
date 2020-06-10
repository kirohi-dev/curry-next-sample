import { ImageObj } from '../model/Curry';

export interface ICurryService {
  listImage(): ImageObj[];
}

export class CurryService implements ICurryService {
  listImage() {
    return [
      {
        id: 1,
        name: 'Curry1',
        imageUrl: '/curry1.jpg',
      },
      {
        id: 2,
        name: 'Curry2',
        imageUrl: '/curry2.jpg',
      },
      {
        id: 3,
        name: 'Curry3',
        imageUrl: '/curry3.jpg',
      },
      {
        id: 4,
        name: 'Curry4',
        imageUrl: '/curry4.jpg',
      },
      {
        id: 5,
        name: 'Curry5',
        imageUrl: '/curry5.jpg',
      },
      {
        id: 6,
        name: 'Curry6',
        imageUrl: '/curry6.jpg',
      },
    ]
  }
}
