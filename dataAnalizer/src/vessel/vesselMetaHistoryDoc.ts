import appConfig from '@/config/appConfig';
import { Document, Schema, connect, model, Model } from 'mongoose';

interface IMMSIMetaHistory {
  mmsi: string;
  histories: IVesselMeta[];
}

interface IMMSIMetaHistoryDocument extends IMMSIMetaHistory, Document {

}

interface IMMSIMetaHistoryModel extends Model<IMMSIMetaHistoryDocument> {

}

interface IVesselMeta {
  callSign?:string;
  imo?: string;
  shipName?: string;
  shipType?: string;
}

const IVesselMetaSchema: Schema<IVesselMeta> = new Schema({
  callSign: {type: String, required: false},
  imo: {type: String, required: false},
  shipName: {type: String, required: false},
  shipType: {type: String, required: false}
});


const MMSIMetaHistorySchema: Schema<IMMSIMetaHistoryDocument> = new Schema({
  mmsi: {type: String, required: true, _id: true},
  histories: [IVesselMetaSchema]
})

const MMSIMetaHistoryModel = model<IMMSIMetaHistoryDocument, IMMSIMetaHistoryModel>('MMSIMetaHistory', MMSIMetaHistorySchema);

export async function run(): Promise<void> {
  await connect(`mongodb://${appConfig.infra.mongodb.hostname}:${appConfig.infra.mongodb.port}/admin`, {
    user: appConfig.infra.mongodb.username,
    pass: appConfig.infra.mongodb.password
  });

  const doc = new MMSIMetaHistoryModel({
    mmsi: '1234',
    histories: [{
      callSign: '123',
      imo: '123',
      shipName: '123',
      shipType: '123'
    }]
  });

  await doc.save();

}




// const schema = new Schema<IVesselMetaHistory>({

// });

// const VesselMetaHistoryModel = model<IVesselMetaHistory>('VesselMetaHistory', schema);

