export type SkillRequirementDraft = {
  id: string;
  skill: string;
  requiredSupports: string;
  optionalSupports: string;
};

export type FilterDraft = {
  requirements: SkillRequirementDraft[];
  hideFailures: boolean;
};
