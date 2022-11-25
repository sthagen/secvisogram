export type Property = Readonly<{
  key: string
  title?: string
  type: 'STRING' | 'ARRAY' | 'OBJECT' | 'RECURSION'
  fullName: ReadonlyArray<string>
  description?: string
  mandatory?: boolean
  enum?: ReadonlyArray<string>
  pattern?: string
  minLength?: number
  addMenuItemsForChildObjects?: boolean
  metaInfo: MetaInfo
  metaData?: MetaData
}>

type MetaInfo = Readonly<{
  propertyList?: ReadonlyArray<Property>
  arrayType?: Property
}>

type MetaData = Readonly<{
  addMenuItemsForChildObjects?: boolean
  uiType?:
    | 'STRING_DATETIME'
    | 'STRING_URI'
    | 'STRING_ENUM'
    | 'STRING_WITH_OPTIONS'
    | 'STRING_MULTI_LINE'
    | 'STRING_PRODUCT_ID'
    | 'STRING_GROUP_ID'
    | 'OBJECT_CWE'
    | 'OBJECT_CVSS_2'
    | 'OBJECT_CVSS_3'
    | 'ARRAY_REVISION_HISTORY'
  relevanceLevels?: {
    csafBase: RelevanceLevel
    csafSecurityIncidentResponse: RelevanceLevel
    csafInformationalAdvisory: RelevanceLevel
    csafSecurityAdvisory: RelevanceLevel
    csafVex: RelevanceLevel
  },
  userDocumentation?: {
    specification: string
    usage: string
  }
  i18n?: {
    title: string
    description: string
  }
  options?: ReadonlyArray<string>
}>

type RelevanceLevel = 'mandatory' | 'want_to_have' | 'best_practice' | 'nice_to_know' | 'optional'