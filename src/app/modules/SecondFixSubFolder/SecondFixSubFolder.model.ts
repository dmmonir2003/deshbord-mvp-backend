import { Schema, model } from 'mongoose';
      import { TSecondFixSubFolder, SecondFixSubFolderModel } from './SecondFixSubFolder.interface';
      
      const SecondFixSubFolderSchema = new Schema<TSecondFixSubFolder, SecondFixSubFolderModel>({
          title: { type: String, required: true },
  secondFixFolderId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  isDeleted: { type: Boolean, default: false },
  }, { timestamps: true });
      
      SecondFixSubFolderSchema.statics.isSecondFixSubFolderExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const SecondFixSubFolder = model<TSecondFixSubFolder, SecondFixSubFolderModel>('SecondFixSubFolder', SecondFixSubFolderSchema);
      