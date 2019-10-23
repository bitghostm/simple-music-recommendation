import { Model } from "objection";

export class Follow extends Model {
  userId: string;
  followerId: string;

  static get tableName() {
    return "follow";
  };
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'followerId'],

      properties: {
        userId: { type: 'string' },
        followerId: { type: 'string' },
      }
    };
  }
}
