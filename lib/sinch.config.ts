import { SinchClient } from "@sinch/sdk-core";

export const {
  SINCH_ACCESS_KEY_ID,
  SINCH_KEY_SECRET,
  SINCH_PROJECT_ID,
  MY_SINCH_NUMBER,
} = process.env;

export const sinchClient = new SinchClient({
  projectId: SINCH_PROJECT_ID,
  keyId: SINCH_ACCESS_KEY_ID,
  keySecret: SINCH_KEY_SECRET,
});
