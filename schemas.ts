import * as coda from "@codahq/packs-sdk";

export const QuestionSchema = coda.makeObjectSchema({
  properties: {
    question_id: { type: coda.ValueType.Number, required: true },
    title: { type: coda.ValueType.String, required: true },
    link: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url, display: 'title', required: true },
    score: { type: coda.ValueType.Number },
    view_count: { type: coda.ValueType.Number },
    answer_count: { type: coda.ValueType.Number },
    tags: { type: coda.ValueType.Array, items: { type: coda.ValueType.String } },
    last_activity_date: { type: coda.ValueType.Number, codaType: coda.ValueHintType.DateTime },
    creation_date: { type: coda.ValueType.Number, codaType: coda.ValueHintType.DateTime },
    body_markdown: { type: coda.ValueType.String, codaType: coda.ValueHintType.Markdown },
    favorited: { type: coda.ValueType.Boolean, required: true },
    is_answered: { type: coda.ValueType.Boolean, required: true }
  },
  displayProperty: "question_id",
  idProperty: "question_id",
  featuredProperties: ["link", "creation_date", "score", "view_count", "answer_count", "tags", "is_answered"],
});

export const TagSchema = coda.makeObjectSchema({
  properties: {
    name: { type: coda.ValueType.String, required: true },
    synonyms: { type: coda.ValueType.Array, items: { type: coda.ValueType.String } },
    relatedTags: { type: coda.ValueType.Array, items: { type: coda.ValueType.String } },
    questionCount: { type: coda.ValueType.Number }
  },
  displayProperty: 'name',
  idProperty: 'name',
  featuredProperties: ['name', 'synonyms', 'relatedTags']
})

export const UserSchema = coda.makeObjectSchema({
  properties: {
    display_name: { type: coda.ValueType.String, required: true },
    profile_image: { type: coda.ValueType.String, codaType: coda.ValueHintType.ImageReference },
    link: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url, display: 'title', required: true },
    reputation: {type: coda.ValueType.Number}, 
  }
})
