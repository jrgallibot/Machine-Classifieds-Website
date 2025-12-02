import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Tree,
  TreeChildren,
  TreeParent,
  ManyToMany
} from 'typeorm';
import { Listing } from './Listing';

@Entity('categories')
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  icon: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @ManyToMany(() => Listing, listing => listing.categories)
  listings: Listing[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to get full category path
  getFullPath(): string {
    let path = this.name;
    let currentParent = this.parent;
    
    while (currentParent) {
      path = `${currentParent.name} > ${path}`;
      currentParent = currentParent.parent;
    }
    
    return path;
  }

  // Helper method to check if category has children
  hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }

  // Helper method to get all child category IDs
  getChildrenIds(): string[] {
    const ids: string[] = [];
    
    const addChildIds = (category: Category) => {
      if (category.children) {
        category.children.forEach(child => {
          ids.push(child.id);
          addChildIds(child);
        });
      }
    };
    
    addChildIds(this);
    return ids;
  }
} 