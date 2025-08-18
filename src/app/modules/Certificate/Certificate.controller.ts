import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CertificateServices } from './Certificate.service';

const createCertificate = catchAsync(async (req, res) => {
  const CertificateData = req.body;
  const result = await CertificateServices.createCertificateIntoDB(CertificateData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate is created successfully',
    data: result,
  });
});

const shareCertificate = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await CertificateServices.shareCertificateIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareCertificate = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await CertificateServices.unShareCertificateIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});


const getSingleCertificate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CertificateServices.getSingleCertificateFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate is retrieved successfully',
    data: result,
  });
});

const getAllCertificates = catchAsync(async (req, res) => {
  const result = await CertificateServices.getAllCertificatesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificates are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateCertificate = catchAsync(async (req, res) => {

  const { id } = req.params;
  const Certificate = req.body;
  const result = await CertificateServices.updateCertificateIntoDB(id, Certificate, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate is updated successfully',
    data: result,
  });
});

const deleteCertificate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CertificateServices.deleteCertificateFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificate is deleted successfully',
    data: result,
  });
});

export const CertificateControllers = {
  createCertificate,
  getSingleCertificate,
  getAllCertificates,
  updateCertificate,
  deleteCertificate,
  shareCertificate,
  unShareCertificate
};
