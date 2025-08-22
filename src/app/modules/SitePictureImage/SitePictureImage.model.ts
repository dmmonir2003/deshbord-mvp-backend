import { Schema, model } from 'mongoose';
      import { TSitePictureImage, SitePictureImageModel } from './SitePictureImage.interface';

      
      const SitePictureImageSchema = new Schema<TSitePictureImage, SitePictureImageModel>({
        file: { type: [String], required: true },
        uploadDate: { type: Date, default: Date.now() },
        projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
        sitePictureFolderId: { type: Schema.Types.ObjectId, ref: 'SitePictureFolder', required: true },
        isDeleted: { type: Boolean, default: false },
      }, { timestamps: true });
      
      SitePictureImageSchema.statics.isSitePictureImageExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const SitePictureImage = model<TSitePictureImage, SitePictureImageModel>('SitePictureImage', SitePictureImageSchema);
      