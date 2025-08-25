import { Schema, model } from 'mongoose';
      import { TSecondFixFolder, SecondFixFolderModel } from './SecondFixFolder.interface';
      
      const SecondFixFolderSchema = new Schema<TSecondFixFolder, SecondFixFolderModel>(  {
    title: { type: String, required: true, unique: true },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },);
      

      SecondFixFolderSchema.statics.isSecondFixFolderExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const SecondFixFolder = model<TSecondFixFolder, SecondFixFolderModel>('SecondFixFolder', SecondFixFolderSchema);
      