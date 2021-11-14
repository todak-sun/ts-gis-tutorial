import { Document, Model, model, Schema } from 'mongoose';

interface IMMSIMetaHistory {
  mmsi: string;
  histories: IVesselMeta[];
}

interface IMMSIMetaHistoryDocument extends IMMSIMetaHistory, Document {

}

interface IMMSIMetaHistoryModel extends Model<IMMSIMetaHistoryDocument> {

}

export interface IVesselMeta {
  callSign?:string;
  imo?: string;
  shipName?: string;
  shipType?: string;
  changedAt?: Date;
}

export const IVesselMetaSchema: Schema<IVesselMeta> = new Schema({
  callSign: {type: String, required: false},
  imo: {type: String, required: false},
  shipName: {type: String, required: false},
  shipType: {type: String, required: false},
  changedAt: {type: Date, required: true}
});

const MMSIMetaHistorySchema: Schema<IMMSIMetaHistoryDocument> = new Schema({
  mmsi: {type: String, required: true, unique: true},
  histories: [IVesselMetaSchema]
})

export const MMSIMetaHistoryModel = model<IMMSIMetaHistoryDocument, IMMSIMetaHistoryModel>('MMSIMetaHistory', MMSIMetaHistorySchema);


