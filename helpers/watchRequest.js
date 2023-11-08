const { REQUEST_POSTFIX, SUCCESS_POSTFIX, FAIL_POSTFIX } = POSTFIXES;

function* sendRequest(action) {
  try {
    const сallMethod = apiCallsMapping(action);
    const response = yield call(сallMethod, action.payload);

    yield put(
      createActionWithPostfix(
        action,
        {
          response: !isEmpty(response) ? response.data : {},
          actionPayload: action.payload,
        },
        SUCCESS_POSTFIX
      )
    );
  } catch (error) {
    console.log(error);
    yield put(
      createActionWithPostfix(
        action,
        {
          response: !isEmpty(error.response)
            ? error.response.data.message
            : "fail",
        },
        FAIL_POSTFIX
      )
    );
  }
}

function* requestEnded() {
  yield delay(REQUEST_PENDING_DELAY);
}

const isApiCallAction = (action) => action.type.endsWith(REQUEST_POSTFIX);

const isApiCallEndedAction = (action) =>
  action.type.endsWith(SUCCESS_POSTFIX) || action.type.endsWith(FAIL_POSTFIX);

function* apiCallsSaga() {
  yield takeEvery(isApiCallAction, sendRequest);
  yield takeEvery(isApiCallEndedAction, requestEnded);
}

export default apiCallsSaga;
