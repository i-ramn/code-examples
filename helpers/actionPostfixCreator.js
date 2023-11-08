import { POSTFIXES } from "../../constans/actionPostfixes";

const { REQUEST_POSTFIX } = POSTFIXES;

const createActionWithPostfix = (action, payload, postfix) => {
  return {
    type:
      action.type.slice(0, action.type.length - REQUEST_POSTFIX.length) +
      postfix,
    payload: {
      response: payload.response,
      actionPayload: payload.actionPayload,
    },
  };
};

export default createActionWithPostfix;
