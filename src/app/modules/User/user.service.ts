/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import mongoose from 'mongoose';

import { TUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { usersSearchableFields } from './user.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

export const createUserIntoDB = async (payload: TUser, user: any) => {

// console.log('payload', payload);
// console.log('user', user);

  const {  userEmail } = user;
  const userData = await User.findOne({ email: userEmail });
console.log('userData', userData);




  if (
    (userData && userData?.role === 'superAdmin') ||
    userData?.role === 'subscriber'
  ){

  if( payload.role === 'admin'){
    payload.subscriberId = userData._id;
  }

  } 
  
  // else {
  //   payload.subscriberId = userData!.subscriberId ?? new mongoose.Types.ObjectId();
  // } 

  // console.log('payload final', payload);

  
    // if(!payload.subscriberId) throw new AppError(httpStatus.BAD_REQUEST, 'Subscriber Id is required');

  // if (payload.role === 'client') {
  //   if (!payload.password) {
  //     payload.password = 'client12345';
  //   }

  //   if(!payload.subscriberId) throw new AppError(httpStatus.BAD_REQUEST, 'Subscriber Id is required');
  // }

  // if (payload.role === 'admin') {

  // // console.log('payload musaaaa2222', payload);


  //   if (!payload.password) {
  //     payload.password = '12345';
  //   }
  //   if(!payload.subscriberId) throw new AppError(httpStatus.BAD_REQUEST, 'Subscriber Id is required');

  // }
  // if (payload.role === 'subscriber') {
  //   if (!payload.password) {
  //     payload.password = 'subscriber12345';
  //   } 
  // }
  console.log('payload final', payload);
  const newUser = await User.create(payload);
    // console.log('newUser', newUser);

  if (!newUser) throw new Error('Failed to create user');

  return newUser;
};

const getMe = async (userEmail: string) => {
  const result = await User.findOne({ email: userEmail  });

  // if(result?.status === 'blocked') throw new AppError(httpStatus.UNAUTHORIZED, 'User Is blocked!');
  if(result?.isDeleted === true) throw new AppError(httpStatus.UNAUTHORIZED, 'User Is Deleted!');

  return result;
};
const getSingleUserIntoDB = async (id: string) => {
  const result = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id), isDeleted: false } },
    {
      $lookup: {
        from: 'quotes', // The MongoDB collection name (usually lowercase plural)
        localField: '_id',
        foreignField: 'userId',
        as: 'quotes',
      },
    },
  ]);

  return result.length ? result[0] : null;
};

// const getSingleUserIntoDB = async (id: string) => {
//   const result = await User.findOne({ _id: id, isDeleted: false }).populate('Quote');

//   return result;
// };
const getAllUsersFromDB = async (query: Record<string, unknown>, usr:any) => {

const {  userEmail } = usr;
const userData = await User.findOne({ email: userEmail });

if(usr?.role === 'subscriber'){
  const studentQuery = new QueryBuilder(
    User.find({
    role: { $nin: ['admin', 'superAdmin'] }, // Only client
    subscriberId: userData?._id, // or userData?.subscriberId if admin
  }),
    query,
  )
    .search(usersSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;

  return {
    meta,
    result,
  };
};
 if(usr?.role === 'admin') {
  const studentQuery = new QueryBuilder(
    User.find({
    role: { $nin: ['superAdmin'] }, // Only client
    subscriberId: userData?.subscriberId, // or userData?.subscriberId if admin
  }),
    query,
  )
    .search(usersSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;

  return {
    meta,
    result,
  };
}

if(usr?.role === 'superAdmin') {
    const studentQuery = new QueryBuilder(
    User.find({ isDeleted: false, role: { $ne: 'superAdmin' } }),
    query,
  )
    .search(usersSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;

  return {
    meta,
    result,
  };
};

};
const getAllUsersForSubscriberFromDB = async (query: Record<string, unknown>, user:any) => {

    const {  userEmail } = user;
  const userData = await User.findOne({ email: userEmail });

let subscriberId;


 if(userData?.role === 'admin') {
   subscriberId = userData?.subscriberId;
 } else if(userData?.role === 'subscriber') {
   subscriberId = userData?._id;
 }else{
//  if(userData?.role === 'superAdmin') return getAllUsersFromDB(query);
 }


  const studentQuery = new QueryBuilder(
    User.find({ role: { $ne: 'superAdmin' }, subscriberId }),
    // User.find({ role: { $ne: 'superAdmin' }, subscriberId: userData?._id }),
    query,
  )
    .search(usersSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;

  return {
    meta,
    result,
  };
};
// const getUsersMonthlyFromDB = async (user: any) => {

//   // console.log(role,'user');

//   if(user.role === 'superAdmin'){
//   const startOfYear = new Date(new Date().getFullYear(), 0, 1); // January 1st, current year
//   const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1); // January 1st, next year
//   console.log(startOfYear, 'endOfYear', endOfYear);

//   const result = await User.aggregate([
//     {
//       $match: {
//         isDeleted: false,
//         createdAt: { $gte: startOfYear, $lt: endOfYear }, // Filter users created in the current year
//       },
//     },
//     {
//       $group: {
//         _id: { $month: '$createdAt' }, // Group by month of 'createdAt'
//         count: { $sum: 1 }, // Count users per month
//       },
//     },
//     {
//       $sort: { _id: 1 }, // Sort by month in ascending order
//     },
//   ]);

//   console.log(result, 'result');

//   // Format result to include month names (optional)
//   const formattedResult = result.map((item) => ({
//     month: new Date(0, item._id - 1).toLocaleString('default', {
//       month: 'long',
//     }),
//     count: item.count,
//   }));

//   console.log(formattedResult, 'formattedResult');

//   return formattedResult;
//   } else if(user.role === 'subscriber'){
//     console.log('subscriber');
//   }


// };
const getUsersMonthlyFromDB = async (userEmailAndRole: any) => {
  const user = await User.isUserExistsByCustomEmail(userEmailAndRole.userEmail)
  if(!user){
    throw new AppError(httpStatus.UNAUTHORIZED, 'User Is Not Found!')
  }
  const startOfYear = new Date(new Date().getFullYear(), 0, 1); // January 1st, current year
  const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1); // January 1st, next year
  // console.log(role,'user');


  const matchCondition: any = {
    isDeleted: false,
    createdAt: { $gte: startOfYear, $lt: endOfYear },
  };


  if(user.role === 'superAdmin'){
  const result = await User.aggregate([
    {
      $match: {
        isDeleted: false,
        createdAt: { $gte: startOfYear, $lt: endOfYear }, // Filter users created in the current year
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' }, // Group by month of 'createdAt'
        count: { $sum: 1 }, // Count users per month
      },
    },
    {
      $sort: { _id: 1 }, // Sort by month in ascending order
    },
  ]);


  // Format result to include month names (optional)
  const formattedResult = result.map((item) => ({
    month: new Date(0, item._id - 1).toLocaleString('default', {
      month: 'long',
    }),
    count: item.count,
  }));

  console.log(formattedResult, 'formattedResult');

  return formattedResult;
  } else if(user.role === 'subscriber'){
        // subscriber only sees their own clients
    matchCondition.role = 'client';
    matchCondition.subscriberId = (user as any)?._id;
  }else {
    return []
  }
const result = await User.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const formattedResult = result.map((item) => ({
    month: new Date(0, item._id - 1).toLocaleString('default', {
      month: 'long',
    }),
    count: item.count,
  }));

  return formattedResult;

};
// const getUsersMonthlyFromDB = async () => {
//   console.log('test now service');

//   const now = new Date();
//   const startOfYear = new Date(Date.UTC(now.getFullYear(), 0, 1));
//   const endOfYear = new Date(Date.UTC(now.getFullYear() + 1, 0, 1));

//   console.log('startOfYear:', startOfYear, 'endOfYear:', endOfYear);

//   const result = await User.aggregate([
//     {
//       $match: {
//         // status: 'active',
//         isDeleted: false,
//         createdAt: { $gte: startOfYear, $lt: endOfYear }
//       }
//     },
//     {
//       $group: {
//         _id: { $month: "$createdAt" },
//         count: { $sum: 1 }
//       }
//     },
//     {
//       $sort: { _id: 1 }
//     }
//   ]);

//   console.log('aggregation result:', result);

//   const allMonths = Array.from({ length: 12 }, (_, i) => ({
//     month: new Date(0, i).toLocaleString('default', { month: 'long' }),
//     count: 0
//   }));

//   result.forEach(item => {
//     allMonths[item._id - 1].count = item.count;
//   });

//   console.log('formattedResult:', allMonths);
//   return allMonths;
// };

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  // if(result?.status === 'blocked'){
  //   if(result?.role === 'client'){
  //      await Client.findOneAndUpdate({userId: result?._id}, {status: 'blocked'}, {new: true}).populate('userId');
  //    }

  //    if(result?.role === 'admin'){
  //     await Admin.findOneAndUpdate({userId: result?._id}, {status: 'blocked'}, {new: true}).populate('userId');
  //   }

  // }

  // if(result?.status === 'active'){
  //   if(result?.role === 'client'){
  //      await Client.findOneAndUpdate({userId: result?._id}, {status: 'active'}, {new: true}).populate('userId');
  //    }

  //    if(result?.role === 'admin'){
  //     await Admin.findOneAndUpdate({userId: result?._id}, {status: 'active'}, {new: true}).populate('userId');
  //   }

  // }

  return result;
};

const updateUserIntoDB = async (
  id: string,
  payload: Partial<TUser>,
  file?: any,
) => {


  const { name, ...userData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = { ...userData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  // Handle file upload if present
  if (file) {
    modifiedUpdatedData.profileImg = file.location as string;
  }

  const result = await User.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  }).select('-password');

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start transaction

  try {
    // Step 1: Check if the user exists
    const user = await User.findById(id).session(session); // Find user with session
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }

    // Step 2: Delete the user
    const deletedUser = await User.findByIdAndDelete(id, { session }); // Pass session for deletion

    // Step 3: Check if a quote exists for the user
    // const quote = await Quote.findOne({ userId: id }).session(session); // Check for quote with userId
    // if (quote) {
    //   await Quote.findOneAndDelete(
    //     { userId: id },
    //     { session }, // Pass session for deletion
    //   );
    // } else {
    //   console.log(`No quote found for user with ID ${id}`);
    // }

    // Step 4: Check if a call booking exists for the user
    // const callBooking = await Booking.findOne({ userId: id }).session(
    //   session,
    // ); // Check for call booking with userId
    // if (callBooking) {
    //   await Booking.findOneAndDelete(
    //     { userId: id },
    //     { session }, // Pass session for deletion
    //   );
    // } else {
    //   console.log(`No call booking found for user with ID ${id}`);
    // }

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    return deletedUser; // Return the deleted user document
  } catch (error) {
    // Rollback the transaction if any operation fails
    await session.abortTransaction();
    session.endSession();
    throw error; // Propagate the error to be handled by the caller
  }
};

export const UserServices = {
  getAllUsersForSubscriberFromDB,
  getSingleUserIntoDB,
  getUsersMonthlyFromDB,
  deleteUserFromDB,
  createUserIntoDB,
  getMe,
  changeStatus,
  getAllUsersFromDB,
  updateUserIntoDB,
};
