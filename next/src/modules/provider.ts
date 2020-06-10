/**
 * DIポイント
 * _app.tsxでDIすると正常に静的ファイル化されない可能性があるので,
 * providerで配信する。
 */

import { CurryUseCase } from './usecase/Curry';
import { CurryService } from './domain/service/Curry';

const curry = new CurryUseCase(new CurryService());

export { curry };
