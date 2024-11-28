import { LOCATION_NAME_MAPPING } from "./commonvars";

export const getLocationKey = (propertyName: string) => {
  return Object.entries(LOCATION_NAME_MAPPING).find(
    ([_, value]) => value.ko === propertyName || value.en === propertyName
  )?.[0];
};
