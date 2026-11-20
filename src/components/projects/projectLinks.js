import { casePages } from "../../seo/pages";

/** Path of the project's full case-study page, if one exists. */
export const casePath = (projectId) => casePages.find((page) => page.projectId === projectId)?.path;

/** Translation key for the project's demo link. */
export const demoLabelKey = (project) => (project.demoLabel === "Watch Demo" ? "watchDemo" : "liveDemo");
