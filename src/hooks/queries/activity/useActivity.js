import { useActivityInstance } from "./instance/useActivityInstance";
import { useActivityTemplate } from "./template/useActivityTemplate";

export const useActivity = instanceId => {
  const instanceQ = useActivityInstance(instanceId);
  const templateQ = useActivityTemplate(instanceQ.data?.template, { enabled: instanceQ.isSuccess });

  return [instanceQ, templateQ];
};
