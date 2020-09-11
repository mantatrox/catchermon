import React from "react";
import {
  Entity,
  PropertyType,
  EntityObject,
  DistributionStatus
} from "../../model/interface";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import moment from "moment";
import { ChipData } from "./Filter";

const processColumns = (entity: Entity) => {
  if (!entity || !entity.options) return [];

  const filtered =
    entity.options.hiddenProperties.length > 0
      ? entity?.properties.filter(
          (p) =>
            entity.options && !entity.options.hiddenProperties.includes(p.name)
        )
      : entity.properties;

  const props = filtered.map((item) => {
    const basic = {
      name: item.label,
      selector: `properties.${item.name}`,
      sortable: true,
      overflow: true
    };

    switch (item.type) {
      case PropertyType.CheckboxProp:
        const cell = (row: EntityObject) => {
          const id = row._id;
          if (!id) return null;

          const obj = entity.items.find((i) => i._id === id);
          if (!obj) return null;
          const value = obj.properties.find((r) => r.propKey === item.name)
            ?.propValue;

          return value === "true" ? <CheckBox /> : <CheckBoxOutlineBlank />;
        };

        return { ...basic, cell };

      case PropertyType.DateProp:
        const sortFunction = (rowA: any, rowB: any) => {
          const tA = moment(rowA.properties[item.name], "DD.MM.YYYY").unix();
          const tB = moment(rowB.properties[item.name], "DD.MM.YYYY").unix();
          return tA - tB;
        };

        return { ...basic, sortFunction };

      default:
        return basic;
    }
  });

  if (entity.options.showReferent)
    props.push({
      name: "Referent",
      selector: "referent",
      sortable: true,
      overflow: true
    });

  return props;
};

const processData = (referent: string, entity: Entity) => {
  if (!entity) return [];
  if (entity.items.length === 0) return [];
  const wi = entity.items
    .filter(
      (item) =>
        item.distribution?.status === DistributionStatus.REPORTED ||
        (item.distribution?.status === DistributionStatus.BOOKED &&
          (item.referent === referent ||
            item.distribution?.referent === referent))
    )
    .map((item) => ({ ...item }));

  try {
    const data = wi.map((item: EntityObject) => {
      const nP: any = {};
      const filtered = item.properties.filter(
        (p) =>
          entity.options && !entity.options.hiddenProperties.includes(p.propKey)
      );
      for (const prop of filtered) {
        const def = entity.properties.find((pr) => pr.name === prop.propKey);
        if (!def) continue;
        if (def.type === PropertyType.DateProp) {
          nP[prop.propKey] =
            prop.propValue === ""
              ? ""
              : moment(prop.propValue).format("DD.MM.YYYY");
          continue;
        }
        let value = prop.propValue;
        if (value === undefined) continue;
        if (value.length > 30) value = value.slice(0, 27) + "...";
        nP[prop.propKey] = value;
      }
      item.properties = nP;
      item.insertDate = moment(item.insertDate).format("DD.MM.YYYY HH:mm");

      return item;
    });
    return data ? data : [];
  } catch (error) {
    console.log(error);
    return entity ? entity.items : [];
  }
};

const applyFilter = (chips: ChipData[], data: any[], entity?: Entity) => {
  if (chips.length === 0) return data;

  const fProps = entity?.properties.filter(
    (p) => !entity.options.hiddenProperties.includes(p.name)
  );

  if (!fProps) return data;

  let toFilter = [...data];

  for (const chip of chips) {
    try {
      toFilter = toFilter.filter((rowObject: any) => {
        return fProps
          .map((prop) => {
            return rowObject.properties[prop.name];
          })
          .some((value: string) => {
            try {
              if (!value || value === "" || value === undefined) return false;
              const v = typeof value === "object" ? value[0] : value;
              return v.toLowerCase().includes(chip.label.toLowerCase());
            } catch (_) {
              throw new Error(
                JSON.stringify({ value, type: typeof value, label: chip.label })
              );
            }
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  return toFilter;
};

export default { processColumns, processData, applyFilter };
