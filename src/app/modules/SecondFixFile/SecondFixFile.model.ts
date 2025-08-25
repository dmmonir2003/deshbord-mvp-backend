import { Schema, model } from 'mongoose';
      import { TSecondFixFile, SecondFixFileModel } from './SecondFixFile.interface';
      
      const SecondFixFileSchema = new Schema<TSecondFixFile, SecondFixFileModel>({
        name: { type: String, required: true },
        description: { type: String },
        atcCodes: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      SecondFixFileSchema.statics.isSecondFixFileExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const SecondFixFile = model<TSecondFixFile, SecondFixFileModel>('SecondFixFile', SecondFixFileSchema);
      