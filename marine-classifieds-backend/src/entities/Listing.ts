import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index
} from 'typeorm';
import { User } from './User';
import { Category } from './Category';

export enum ListingStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SOLD = 'sold',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

export enum ListingType {
  FREE = 'free',
  PREMIUM = 'premium',
  FEATURED = 'featured'
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column()
  location: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.DRAFT
  })
  status: ListingStatus;

  @Column({
    type: 'enum',
    enum: ListingType,
    default: ListingType.FREE
  })
  type: ListingType;

  @Column({ default: 0 })
  views: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  expiryDate: Date;

  @ManyToOne(() => User, user => user.listings)
  user: User;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to check if listing is active
  isActive(): boolean {
    return this.status === ListingStatus.ACTIVE;
  }

  // Helper method to check if listing is expired
  isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
  }

  // Helper method to format price
  getFormattedPrice(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.price);
  }
} 