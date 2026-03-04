export interface ContactFields {
  titleZh: string
  titleEn: string
  email: string
  tel: string
}

export interface InterviewFields {
  titleZh: string
  titleEn: string
  descriptionZh: string
  descriptionEn: string
  firstRoundLabel: string
  firstRoundDate: string
  secondRoundLabel: string
  secondRoundDate: string
}

export interface AboutUsOrganization {
  role: string
  name: string
  logo: string
  url: string
}

export interface AboutUsFields {
  titleZh: string
  titleEn: string
  organizations: AboutUsOrganization[]
}

export interface ProjectIntroInfoCard {
  titleZh: string
  titleEn: string
  contentZh: string
  contentEn: string
}

export interface ProjectIntroFields {
  titleZh: string
  subtitleZh: string
  titleEn: string
  subtitleEn: string
  descriptionZh: string
  descriptionEn: string
  posterUrl: string
  infoCards: ProjectIntroInfoCard[]
  eligibilityZh: string[]
  eligibilityEn: string[]
  feeZh: string[]
  feeEn: string[]
}

export interface Position {
  companyLines: string[]
  roleLines: string[]
  requirements: string[]
  duties: string[]
}

export interface PositionGroup {
  location: string
  description: string
  positions: Position[]
}

export interface PositionsFields {
  titleZh: string
  titleEn: string
  groups: PositionGroup[]
}

export interface TimelineStep {
  date: string
  content: string[]
  highlight: boolean
}

export interface TimelineNote {
  icon: string
  title: string
  content: string[]
}

export interface TimelineFields {
  titleZh: string
  titleEn: string
  steps: TimelineStep[]
  notes: TimelineNote[]
}

export interface HeaderLink {
  titleZh: string
  titleEn: string
  href: string
  primary: boolean
}

export interface FooterQuickLink {
  label: string
  href: string
  primary: boolean
}

export interface FooterSocialLink {
  label: string
  href: string
  icon: string
}

export interface SiteSettingsFields {
  logoHeight: number
  headerLinks: HeaderLink[]
  footerQuickLinks: FooterQuickLink[]
  footerSocialLinks: FooterSocialLink[]
}

export type ContentSlug = "contact" | "interview" | "about_us" | "project_intro" | "positions" | "timeline" | "site_settings"

export type ContentFields = ContactFields | InterviewFields | AboutUsFields | ProjectIntroFields | PositionsFields | TimelineFields | SiteSettingsFields

