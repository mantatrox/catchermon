import { IDataTableConditionalRowStyles } from "react-data-table-component";
import {
  DistributionStatus,
  Entity,
  EntityObject
} from "../../model/interface";

export const conditionalRowStyle = (referent: string, entity?: Entity) => {
  if (!entity || !entity.options.useConditionalFormatting) return [];
  return [
    {
      when: (row: EntityObject) => row.referent === referent,
      style: {
        backgroundColor: "#ecffe6"
      }
    },
    {
      when: (row: EntityObject) => row.distribution?.referent === referent,
      style: {
        backgroundColor: "#ffffcc"
      }
    },
    {
      when: (row: EntityObject) =>
        row.referent === referent &&
        row.distribution?.status === DistributionStatus.BOOKED,
      style: {
        backgroundColor: "#ffe6cc"
      }
    }
  ] as IDataTableConditionalRowStyles<EntityObject>[];
};
