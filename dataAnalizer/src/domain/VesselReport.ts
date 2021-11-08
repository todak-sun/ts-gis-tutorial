import {ExactEarthMessage, SpireMessage} from '..';

type Vessel = {
  mmsi: string;
  callSign: string;
  imo: string;
  shipType: string;
  shipName: string;
};

type Report = {
  position: number[];
  updatedAt: Date;
};

class VesselReport {
  private vessel: Vessel;
  private report: Report;

  private constructor(vessel: Vessel, report: Report) {
    this.vessel = vessel;
    this.report = report;
  }
}

export default VesselReport;

function convertToDate(datestr: string): Date {
  const target = datestr.split('').map((s) => s);
  const arr: string[] = [];
  [4, 2, 2, 2, 2, 2].forEach((num) => arr.push(target.splice(0, num).join('')));
  return new Date(`${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}:${arr[5]}`);
}
