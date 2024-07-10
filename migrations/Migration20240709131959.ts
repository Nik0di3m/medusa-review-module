import { Migration } from '@mikro-orm/migrations';

export class Migration20240709131959 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "review_model" ("id" text not null, "rating" integer not null default 0, "comment" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "review_model_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "review_model" cascade;');
  }

}
