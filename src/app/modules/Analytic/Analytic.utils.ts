/* eslint-disable @typescript-eslint/no-explicit-any */
import { Interim } from "../Interim/Interim.model";
import { LiveProjectCostServices } from "../LiveProjectCost/LiveProjectCost.service";
import { Project } from "../Project/Project.model";

export const getAllProjectProfit = async () => {
  // Get all projects with status "completed" or "ongoing"
  const projects = await Project.find({
    status: { $in: ["completed", "ongoing"] }
  });

  // Loop over each project and calculate total value and profit concurrently
  const projectsWithProfitAndTotalValue = await Promise.all(projects.map(async (project) => {
    // Get all paid interims for this project
    const allInterims = await Interim.find({ projectId: project._id, status: 'paid' });
    const totalInterimValue = allInterims.reduce((sum, interim) => sum + interim.value, 0);

    // Get all costs for this project
    const query = { projectId: project._id };
    const allCost = await LiveProjectCostServices.getAllTypeLiveProjectCostsFromDB(query);
    const totalCost = allCost.result.find((e: any) => e.name === 'Total');

    // Calculate profit
    const profit = totalCost?.amount ? totalInterimValue - totalCost.amount : 0;
    return {
      projectId: project._id.toString(),
      // projectTitle: project.title || '',
      profit  // Include the profit for the project
    };
  }));

  // Calculate the total profit of all projects
  const totalProfit = projectsWithProfitAndTotalValue.reduce((sum, project: any) => sum + project.profit, 0);

  // Return the projects with their profit and the total profit
//   return {
//     projects: projectsWithProfitAndTotalValue,
//     totalProfit
//   };
  return totalProfit;
};

export const getSingleProjectProfit = async (id: string) => {
    // Get all paid interims for this project
    const allInterims = await Interim.find({ projectId: id, status: 'paid' });
    const totalInterimValue = allInterims.reduce((sum, interim) => sum + interim.value, 0);
    // Get all costs for this project
    const query = { projectId: id };
    const allCost = await LiveProjectCostServices.getAllTypeLiveProjectCostsFromDB(query);
    const totalCost = allCost.result.find((e: any) => e.name === 'Total');
    // Calculate profit
    const profit = totalCost?.amount ? totalInterimValue - totalCost.amount : 0;
  



  return profit;
};