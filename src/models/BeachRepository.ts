import mongoose, { Model } from 'mongoose';

export enum GeoPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  _id?: string;
  name: string;
  position: GeoPosition;
  lat: number;
  lng: number;
  user: string;
}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    toJSON: {
      transform(_, ret): void {
        /* eslint-disable */
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        /* eslint-enable */
      },
    },
  },
);

interface BeachModel extends Omit<Beach, '_id'>, Document { }

const BeachRepository: Model<BeachModel> = mongoose.model('Beach', schema);

export default BeachRepository;
