import { all } from 'redux-saga/effects';

import { authSaga } from '@app/modules/auth/redux/auth.saga';
import { registrationSaga } from '@app/modules/registration/redux/registration.saga';

export function* rootSaga(): Generator {
  yield all([authSaga(), registrationSaga()]);
}
