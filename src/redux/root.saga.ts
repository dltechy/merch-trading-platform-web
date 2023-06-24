import { all } from 'redux-saga/effects';

import { authSaga } from '@app/modules/auth/redux/auth.saga';
import { itemsSaga } from '@app/modules/items/redux/items.saga';
import { registrationSaga } from '@app/modules/registration/redux/registration.saga';
import { userItemsSaga } from '@app/modules/user-items/redux/user-items.saga';
import { userWishesSaga } from '@app/modules/user-wishes/redux/user-wishes.saga';

export function* rootSaga(): Generator {
  yield all([
    authSaga(),
    registrationSaga(),
    itemsSaga(),
    userItemsSaga(),
    userWishesSaga(),
  ]);
}
