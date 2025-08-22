import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SitePictureServices } from './SitePicture.service';

const createSitePicture = catchAsync(async (req, res) => {
  const SitePictureData = req.body;
  const result = await SitePictureServices.createSitePictureIntoDB(SitePictureData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePicture is created successfully',
    data: result,
  });
});


const shareSitePictureFolder = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await SitePictureServices.shareSitePictureFolderIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareSitePictureFolder = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await SitePictureServices.unShareSitePictureFolderIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});


const getSingleSitePicture = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SitePictureServices.getSingleSitePictureFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePicture is retrieved successfully',
    data: result,
  });
});

const getAllSitePictures = catchAsync(async (req, res) => {
  const result = await SitePictureServices.getAllSitePicturesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePictures are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSitePicture = catchAsync(async (req, res) => {
  const { id } = req.params;
  const SitePicture = req.body;
  const result = await SitePictureServices.updateSitePictureIntoDB(id, SitePicture);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePicture is updated successfully',
    data: result,
  });
});

const deleteSitePicture = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SitePictureServices.deleteSitePictureFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePicture is deleted successfully',
    data: result,
  });
});

export const SitePictureControllers = {
  createSitePicture,
  getSingleSitePicture,
  getAllSitePictures,
  updateSitePicture,
  deleteSitePicture,
  shareSitePictureFolder,
  unShareSitePictureFolder
};
