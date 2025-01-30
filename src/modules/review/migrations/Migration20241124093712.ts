import { Migration } from '@mikro-orm/migrations';

export class Migration20241124093712 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "review" ("id" text not null, "title" text not null, "content" text not null, "status" text check ("status" in (\'approved\', \'draft\', \'rejected\')) not null default \'draft\', "rating" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "review_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "review" cascade;');
  }

}
