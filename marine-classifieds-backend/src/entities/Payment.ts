import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';
import { Listing } from './Listing';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal'
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentProvider
  })
  provider: PaymentProvider;

  @Column({ nullable: true })
  transactionId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Listing)
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  refundReason: string;

  @Column({ nullable: true })
  refundedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to check if payment is successful
  isSuccessful(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  // Helper method to check if payment can be refunded
  canBeRefunded(): boolean {
    return (
      this.status === PaymentStatus.COMPLETED &&
      !this.refundedAt &&
      new Date().getTime() - this.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000 // 30 days
    );
  }

  // Helper method to format amount
  getFormattedAmount(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.amount);
  }

  // Helper method to get payment provider name
  getProviderName(): string {
    return this.provider.charAt(0).toUpperCase() + this.provider.slice(1);
  }
} 