import {Entity,PrimaryGeneratedColumn,Column} from 'typeorm'

@Entity()
export class UserEntity{
  @PrimaryGeneratedColumn()
  id:number;

  @Column({ nullable: false })
  firstName:string;

  @Column({ nullable: false })
  lastName:string;
  
  @Column({ nullable: false, unique: true  })
  email:string;

  @Column({ nullable: false })
  password:string
}
