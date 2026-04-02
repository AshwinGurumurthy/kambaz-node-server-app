import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";
import moduleModel from "./model.js";
export default function ModulesDao() {

  async function findModulesForCourse(courseId) {
  const course = await model.findById(courseId);
  const embeddedModules = course ? course.modules : [];

  const legacyModules = await moduleModel.find({ course: courseId });

  return [...legacyModules, ...embeddedModules];
}

 async function createModule(courseId, module) {
   const newModule = { ...module, _id: uuidv4() };
   const status = await model.updateOne(
     { _id: courseId },
     { $push: { modules: newModule } }
   );
   return newModule;
 }

 async function deleteModule(courseId, moduleId) {
  const status = await model.updateOne(
    { _id: courseId, "modules._id": moduleId },
    { $pull: { modules: { _id: moduleId } } }
  );

  if (status.modifiedCount > 0) {
    return status;
  }

  const legacyStatus = await moduleModel.deleteOne({
    _id: moduleId,
    course: courseId,
  });

  return legacyStatus;
}

async function updateModule(courseId, moduleId, moduleUpdates) {
  const course = await model.findById(courseId);
  if (course) {
    const embeddedModule = course.modules.id(moduleId);
    if (embeddedModule) {
      Object.assign(embeddedModule, moduleUpdates);
      await course.save();
      return embeddedModule.toObject();
    }
  }

  const legacyModule = await moduleModel.findByIdAndUpdate(
    moduleId,
    { $set: moduleUpdates },
    { new: true }
  );

  return legacyModule ? legacyModule.toObject() : null;
}



 return {
   findModulesForCourse,
   createModule,
   deleteModule,
   updateModule
 };
}

