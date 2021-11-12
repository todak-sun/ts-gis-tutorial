import appConfig from '@/config/appConfig';
import { Document, Schema, connect } from 'mongoose';

interface IMMSIMetaHistory {
  mmsi: string;
  histories: IVesselMeta[];
}

interface IMMSIMetaHistoryDocument extends IMMSIMetaHistory, Document {

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
  mmsi: {type: String, required: true},
  histories: [IVesselMetaSchema]
})


export async function run(): Promise<void> {
  await connect(`mongodb://${appConfig.infra.mongodb.hostname}:${appConfig.infra.mongodb.port}`, {
    user: appConfig.infra.mongodb.username,
    pass: appConfig.infra.mongodb.password
  })
}




// const schema = new Schema<IVesselMetaHistory>({

// });

// const VesselMetaHistoryModel = model<IVesselMetaHistory>('VesselMetaHistory', schema);

