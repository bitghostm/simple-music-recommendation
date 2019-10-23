import { Model } from "objection";

export class Listen extends Model {
  userId: string;
  musicId: string;

  static get tableName() {
    return "listen";
  };
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'musicId'],

      properties: {
        userId: { type: 'string' },
        musicId: { type: 'string' },
      }
    };
  }
}
