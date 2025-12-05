import { z } from 'zod'

export const Gender = z.enum(['male', 'female', 'others'])
export const InstitutionStatus = z.enum(['verified', 'unverified'])
export const EntityStatus = z.enum(['approved', 'active', 'rejected', 'pending', 'inactive'])
export const DocumentType = z.enum(['JD', 'certificate', 'resume'])
export const ActivityType = z.enum(['GD', 'interview', 'seminar', 'course'])
export const ActivityCategory = z.enum(['Independent', 'PartOfDrive', 'PreRequisite'])
export const PaymentStatus = z.enum(['successful', 'refunded', 'pending'])
export const TransactionType = z.enum(['onboarding', 'drive', 'activity'])
export const AudienceTypeName = z.enum(['Institution', 'Public'])
export const PriceType = z.enum(['Onboarding', 'Activity'])


