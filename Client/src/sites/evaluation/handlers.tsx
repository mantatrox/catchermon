import { Entity, EntityObject, PropertyType } from "../../model/interface";
import moment from "moment";
import assert from "assert";
import React from "react";
import XLSX from "xlsx";

export interface ClinicCounter {
  clinic: string;
  counter: number;
}

export interface ExportOptions {
  years: number[];
  entity: Entity;
}

function getYears(entity: Entity) {
  return entity.items
    .map((item) => {
      return getItemYear(item, entity);
    })
    .filter((v, i, a) => a.indexOf(v) === i && v > 0)
    .sort((a, b) => b - a);
}

function getItemYear(item: EntityObject, entity: Entity) {
  const prop = item.properties.find((prop) => prop.propKey === "insertDate");
  if (!prop) return -1;
  const val =
    typeof prop.propValue === "object" ? prop.propValue[0] : prop.propValue;

  const year = moment(val).year();
  assert.strictEqual(typeof year, "number");

  return year;
}

function getItemClinic(item: EntityObject, entity: Entity) {
  if (!entity) return "";
  const prop = item.properties.find((prop) => prop.propKey === "clinic");
  if (!prop) return "";

  return typeof prop.propValue === "object"
    ? prop.propValue[0]
    : prop.propValue;
}

function getClinics(entity: Entity): string[] {
  if (!entity || !entity.items) return [];

  return entity.items
    .map((item) => {
      return getItemClinic(item, entity);
    })
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();
}

function getNumberByClinic(
  clinic: string,
  selectedYear: number,
  entity: Entity
) {
  if (!entity) return -1;

  return entity.items.filter((item) => {
    const cl = getItemClinic(item, entity);
    const year = getItemYear(item, entity);

    return cl === clinic && year === selectedYear;
  }).length;
}

function calculate(
  selectedYear: number,
  entity: Entity,
  setCalculation?: (calcs: ClinicCounter[]) => void
) {
  const calcs: ClinicCounter[] = getClinics(entity).map((clinic) => {
    return { clinic, counter: getNumberByClinic(clinic, selectedYear, entity) };
  });

  let sum = 0;
  calcs.forEach((calc) => (sum += calc.counter));

  calcs.push({ clinic: "Gesamt", counter: sum });

  if (setCalculation) setCalculation(calcs);
  return calcs;
}

function lastOneFat(element: any, index: number, list: ClinicCounter[]) {
  if (index === list.length - 1) return <b>{element}</b>;
  return <>{element}</>;
}

function getItemsByYear(entity: Entity, year: number) {
  return entity.items.filter((item) => getItemYear(item, entity) === year);
}

function transformForExport(entity: Entity, year: number) {
  const items = getItemsByYear(entity, year);

  const labels = entity.properties.map((prop) => {
    return {
      name: prop.name,
      label: prop.label,
      type: prop.type
    };
  });

  const data: any[] = [];

  for (const item of items) {
    let obj: any = {};
    for (const prop of item.properties) {
      const lt = labels.find((l) => l.name === prop.propKey);
      if (!lt) continue;
      const label = lt.label;
      const type = lt.type;

      switch (type) {
        case PropertyType.DateProp:
          const val = moment(prop.propValue).format("DD.MM.YYYY");
          obj[label] = val.match(/invalid date/i) ? "" : val;
          break;

        case PropertyType.CheckboxProp:
          obj[label] = prop.propValue === "true" ? "X" : "";
          break;

        default:
          obj[label] = prop.propValue;
          break;
      }
    }
    data.push(obj);
  }

  return { labels, data };
}

function exportExcel(options: ExportOptions) {
  const wb = XLSX.utils.book_new();

  for (const year of options.years.sort()) {
    const { labels, data } = transformForExport(options.entity, year);
    const calculations = calculate(year, options.entity);

    const sheet = XLSX.utils.json_to_sheet(data, {
      header: labels.map((l) => l.label)
    });

    const sheet2 = XLSX.utils.json_to_sheet(
      calculations.map((c) => {
        return { Klinik: c.clinic, Anzahl: c.counter };
      }),
      {
        header: ["Klinik", "Anzahl"]
      }
    );

    XLSX.utils.book_append_sheet(wb, sheet, year.toString());
    XLSX.utils.book_append_sheet(wb, sheet2, `${year.toString()} Auswertung`);
  }

  XLSX.writeFile(wb, "export.xlsx");
}

export { calculate, getYears, lastOneFat, exportExcel };
