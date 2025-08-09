import { Schema, model } from 'mongoose';
      import { TLiveProjectCost, LiveProjectCostModel } from './LiveProjectCost.interface';
      
      const LiveProjectCostSchema = new Schema<TLiveProjectCost, LiveProjectCostModel>({
        name: { type: String, required: true },
        description: { type: String },
        atcCodes: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      LiveProjectCostSchema.statics.isLiveProjectCostExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const LiveProjectCost = model<TLiveProjectCost, LiveProjectCostModel>('LiveProjectCost', LiveProjectCostSchema);
      