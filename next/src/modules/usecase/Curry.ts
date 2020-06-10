import { ICurryService } from '../domain/service/Curry';
import { ImageObj } from '../domain/model/Curry';

export interface ICurryUseCase {
  listImage(): ImageObj[];
}

export class CurryUseCase implements ICurryUseCase {
  private curry: ICurryService;

  constructor(curry: ICurryService) {
    this.curry = curry;
  }

  listImage() {
    return this.curry.listImage();
  }
}
