import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import VesselReport from '@/vessel/VesselReport';

@Entity({name: 'vessel'})
export default class Vessel {
  @PrimaryGeneratedColumn({name: 'vessel_id'})
  private id!: number;

  @Column({name: 'mmsi', nullable: false})
  private mmsi!: string;

  @Column({name: 'call_sign'})
  private callSign!: string;

  @Column({name: 'imo'})
  private imo!: string;

  @Column({name: 'ship_name'})
  private shipName!: string;

  @Column({name: 'ship_type'})
  private shipType!: string;

  @Column({name: 'renewal_datetime', nullable: false})
  private renewalDateTime!: Date;

  @Column({name: 'created_datetime', nullable: false})
  private createdDateTime!: Date;

  @Column({name: 'updated_datetime', nullable: false})
  private updatedDateTime!: Date;

  public static createWith(vesselReport: VesselReport): Vessel {
    const vessel = new Vessel();
    vessel.mmsi = vesselReport.getMMSI();
    vessel.callSign = vesselReport.getCallSign();
    vessel.imo = vesselReport.getIMO();
    vessel.shipName = vesselReport.getShipName();
    vessel.shipType = vesselReport.getShipType();
    vessel.renewalDateTime = vesselReport.getUpdatedAt();
    vessel.createdDateTime = new Date();
    vessel.updatedDateTime = new Date();
    return vessel;
  }

  public getId(): number {
    return this.id;
  }

  public equalsWith(vesselReport: VesselReport): boolean {
    return (
      this.callSign === vesselReport.getCallSign() &&
      this.imo === vesselReport.getIMO() &&
      this.shipName === vesselReport.getShipName() &&
      this.shipType === vesselReport.getShipType() &&
      this.renewalDateTime.getTime() !== vesselReport.getUpdatedAt().getTime()
    );
  }

  public updateWith(vesselReport: VesselReport): void {
    if (this.callSign !== vesselReport.getCallSign()) {
      this.callSign = vesselReport.getCallSign();
    }
    if (this.imo !== vesselReport.getIMO()) {
      this.imo = vesselReport.getIMO();
    }
    if (this.shipName !== vesselReport.getShipName()) {
      this.shipName = vesselReport.getShipName();
    }
    if (this.shipType !== vesselReport.getShipType()) {
      this.shipType = vesselReport.getShipType();
    }
    if (this.renewalDateTime.getTime() !== vesselReport.getUpdatedAt().getTime()) {
      this.renewalDateTime = vesselReport.getUpdatedAt();
    }
    this.updatedDateTime = new Date();
  }
}
