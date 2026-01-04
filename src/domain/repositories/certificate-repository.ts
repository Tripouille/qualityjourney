import type { Certificate } from '@/domain/entities/certificate';

/**
 * Certificate Repository Interface
 * Defines the contract for certificate data access
 */
export interface CertificateRepository {
  /**
   * Find all certificates for a user
   */
  findByUserId(userId: string): Promise<Certificate[]>;

  /**
   * Find a certificate by ID
   */
  findById(id: string): Promise<Certificate | null>;

  /**
   * Find a certificate by certificate number
   */
  findByCertificateNumber(certificateNumber: string): Promise<Certificate | null>;

  /**
   * Issue a new certificate
   */
  create(certificate: Omit<Certificate, 'id' | 'issueDate'>): Promise<Certificate>;

  /**
   * Revoke a certificate
   */
  revoke(id: string): Promise<void>;

  /**
   * Verify a certificate by certificate number
   */
  verify(certificateNumber: string): Promise<Certificate | null>;
}
