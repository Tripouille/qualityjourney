/**
 * Certificate Entity
 * Represents a course completion certificate
 */

export type CertificateStatus = 'active' | 'revoked';

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  issueDate: Date;
  certificateNumber: string;
  status: CertificateStatus;
  pdfUrl: string | null;
  verificationUrl: string;
}
