import { useTranslation } from "react-i18next";
import myData from "../data.json";

/** Merges static data with the active language's copy. */
export default function usePortfolioContent() {
  const { t } = useTranslation();
  const personal = { ...myData.MyInformation[0], ...t("personal", { returnObjects: true }) };
  const projects = myData.myProjects.map((project) => ({
    ...project,
    ...t(`projectContent.${project.id}`, { returnObjects: true }),
  }));
  return { personal, projects };
}
