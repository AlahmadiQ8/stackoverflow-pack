import * as coda from "@codahq/packs-sdk";

export const questionSchema = coda.makeObjectSchema({
  properties: {
    question_id: { type: coda.ValueType.Number },
    title: { type: coda.ValueType.String },
    link: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url, display: 'title' },
    score: { type: coda.ValueType.Number },
    view_count: { type: coda.ValueType.Number },
    answer_count: { type: coda.ValueType.Number },
    tags: { type: coda.ValueType.Array, items: { type: coda.ValueType.String } },
    last_activity_date: { type: coda.ValueType.Number, codaType: coda.ValueHintType.DateTime },
    creation_date: { type: coda.ValueType.Number, codaType: coda.ValueHintType.DateTime },
    body_markdown: { type: coda.ValueType.String, codaType: coda.ValueHintType.Markdown }
  },
  displayProperty: "question_id",
  idProperty: "question_id",
  featuredProperties: ["link", "creation_date", "score", "view_count", "answer_count", "tags"],
});
