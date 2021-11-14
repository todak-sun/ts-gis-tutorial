import { Feature, SpireData } from '@core/responseTypes';

export type Vendor = 'S' | 'E';

export type Vessel = {
  mmsi: string;
  callSign: string;
  imo: string;
  shipType: string;
  shipName: string;
};

export type Report = {
  position: number[];
  updatedAt: Date;
};

export interface AisMessage<T> {
  _vendor: Vendor;
  data: T;
}

class VesselReport {
  private vessel: Vessel;
  private report: Report;

  public constructor(aisMessage: AisMessage<any>) {
    switch (aisMessage._vendor) {
      case 'S':
        const spireData: SpireData = aisMessage.data;
        this.vessel = {
          mmsi: `${spireData.mmsi}`,
          callSign: spireData.call_sign,
          imo: `${spireData.imo}`,
          shipType: spireData.ship_type,
          shipName: spireData.name,
        };
        this.report = {
          position: spireData.last_known_position.geometry.coordinates,
          updatedAt: new Date(spireData.static_updated_at),
        };
        break;
      case 'E':
        const feature: Feature = aisMessage.data;
        this.vessel = {
          mmsi: `${feature.properties.mmsi}`,
          callSign: feature.properties.call_sign,
          imo: `${feature.properties.imo}`,
          shipType: feature.properties.ship_type,
          shipName: feature.properties.ship_name,
        };
        this.report = {
          position: feature.geometry.coordinates,
          updatedAt: convertToDate(feature.properties.time_static),
        };
        break;
      default:
        throw new Error('잘못된 메시지 형태');
    }
  }

  public getMMSI(): string {
    return this.vessel.mmsi;
  }

  public getIMO(): string {
    return this.vessel.imo;
  }

  public getCallSign(): string {
    return this.vessel.callSign;
  }

  public getShipType(): string {
    return this.vessel.shipType;
  }

  public getShipName(): string {
    return this.vessel.shipName;
  }

  public getUpdatedAt(): Date {
    return this.report.updatedAt;
  }

  public toString(): string {
    return `vesssel : ${JSON.stringify(this.vessel)}, report : ${JSON.stringify(this.report)}`;
  }
}

export default VesselReport;

function convertToDate(datestr: string): Date {
  const target = datestr.split('').map((s) => s);
  const arr: string[] = [];
  [4, 2, 2, 2, 2, 2].forEach((num) => arr.push(target.splice(0, num).join('')));
  return new Date(`${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}:${arr[5]}`);
}
